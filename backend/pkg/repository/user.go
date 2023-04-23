package repository

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/config"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/golang/glog"
	"github.com/mitchellh/mapstructure"
	"google.golang.org/api/iterator"

	firebaseAuth "firebase.google.com/go/auth"
)

func (fr *FirebaseRepository) initializeProfilesListener() {
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newProfiles := make(map[string]*models.Profile)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Profile
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newProfiles[doc.Ref.ID] = &c
		}

		fr.profilesLock.Lock()
		defer fr.profilesLock.Unlock()
		fr.profiles = newProfiles

		return nil
	}

	done := make(chan func())
	query := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating user profiles collection listener: %v\n", err)
		}
	}()
	<-done
}

// VerifySessionCookie verifies that the given session cookie is valid and returns the associated User if valid.
func (fr *FirebaseRepository) VerifySessionCookie(sessionCookie *http.Cookie) (*models.User, error) {
	decoded, err := fr.authClient.VerifySessionCookieAndCheckRevoked(firebase.Context, sessionCookie.Value)

	if err != nil {
		return nil, fmt.Errorf("error verifying cookie: %v\n", err)
	}

	user, err := fr.GetUserByID(decoded.UID)
	if err != nil {
		return nil, fmt.Errorf("error getting user from cookie: %v\n", err)
	}

	return user, nil
}

func (fr *FirebaseRepository) CreateUser(req *models.CreateUserRequest) (*models.User, error) {
	if err := utils.ValidateCreateUserRequest(req); err != nil {
		return nil, err
	}

	// Create a user in Firebase Auth.
	u := (&firebaseAuth.UserToCreate{}).Email(req.Email).Password(req.Password)
	fbUser, err := fr.authClient.CreateUser(firebase.Context, u)
	if err != nil {
		return nil, fmt.Errorf("error creating user: %v\n", err)
	}

	profile := &models.Profile{
		ID:              fbUser.UID,
		DisplayName:     req.DisplayName,
		Email:           req.Email,
		Courses:         make([]string, 0),
		DefaultSections: make(map[string]string),
		ActualSections:  make(map[string]map[string]string),
		Permissions:     map[string]models.CoursePermission{},
	}

	_, err = fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(profile.ID).Set(firebase.Context, profile)
	if err != nil {
		return nil, fmt.Errorf("error creating user profile: %v\n", err)
	}

	return fbUserToUserRecord(fbUser, profile), nil
}

func (fr *FirebaseRepository) GetUserByID(id string) (*models.User, error) {
	if err := utils.ValidateID(id); err != nil {
		return nil, err
	}

	fbUser, err := fr.authClient.GetUser(firebase.Context, id)
	if err != nil {
		return nil, qerrors.UserNotFoundError
	}

	// Check the Firebase user's email against the list of allowed domains.
	if len(config.Config.AllowedEmailDomains) > 0 {
		domain := strings.Split(fbUser.Email, "@")[1]
		if !utils.Contains(config.Config.AllowedEmailDomains, domain) {
			// invalid email domain, delete the user from Firebase Auth
			_ = fr.authClient.DeleteUser(firebase.Context, fbUser.UID)
			return nil, qerrors.InvalidEmailError
		}
	}

	profile, err := fr.GetProfileById(fbUser.UID)
	if err != nil {
		// no profile for the user found, create one.
		profile, err = fr.createProfileFromFbUser(fbUser)
		if err != nil {
			return nil, err
		}
		err = fr.executeInviteForUser(fbUserToUserRecord(fbUser, profile))
		if err != nil {
			glog.Warningf("there was a problem adding course permission to a user: %v\n", err)
		}
	}

	return fbUserToUserRecord(fbUser, profile), nil
}

func (fr *FirebaseRepository) GetProfileById(id string) (*models.Profile, error) {
	fr.profilesLock.RLock()
	defer fr.profilesLock.RUnlock()

	if val, ok := fr.profiles[id]; ok {
		return val, nil
	} else {
		return nil, qerrors.UserProfileNotFoundError
	}
}

// GetUserByEmail retrieves the User associated with the given email.
func (fr *FirebaseRepository) GetUserByEmail(email string) (*models.User, error) {
	userID, err := fr.GetIDByEmail(email)
	if err != nil {
		return nil, err
	}

	return fr.GetUserByID(userID)
}

func (fr *FirebaseRepository) GetIDByEmail(email string) (string, error) {
	// Get user by email.
	iter := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Where("email", "==", email).Documents(firebase.Context)
	doc, err := iter.Next()
	if err != nil {
		return "", err
	}
	// Cast.
	data := doc.Data()
	return data["id"].(string), nil
}

func (fr *FirebaseRepository) HandleJoinCourseRequest(req *models.JoinCourseRequest) (course *models.Course, internalError error, requestError error) {
	// Check if course exists
	course, err := fr.GetCourseByEntryCode(req.EntryCode)
	if err != nil {
		return nil, nil, err
	}

	// Check if course is active
	if course.Status != models.CourseActive {
		return nil, nil, fmt.Errorf("Cannot join an inactive or archived course")
	}

	studentExists, studentIsStaff, err := fr.addStudentToCourse(req.User, course)
	if studentExists {
		return nil, nil, fmt.Errorf("Student is already enrolled in course")
	}
	if studentIsStaff {
		return nil, nil, fmt.Errorf("Cannot join course as staff")
	}

	if err != nil {
		return nil, err, nil
	}

	return course, nil, nil
}

func (fr *FirebaseRepository) HandleQuitCourseRequest(req *models.QuitCourseRequest) error {
	err := fr.deleteStudentFromCourse(req.User.ID, req.CourseID)
	return err
}

func (fr *FirebaseRepository) EditAdminAccess(req *models.EditAdminAccessRequest) (wasAdmin bool, err error) {
	user, err := fr.GetUserByEmail(req.Email)

	if err != nil {
		// if user does not exist, add to or remove from invites
		if req.IsAdmin {
			wasAdmin, err = fr.createAdminInvite(req)
			return wasAdmin, err
		} else {
			err = fr.removeAdminInvite(req)
			return false, err
		}
	}

	docRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(user.ID)
	doc, err := docRef.Get(firebase.Context)
	if err != nil {
		return false, err
	}

	// if user was already admin
	data := doc.Data()
	if req.IsAdmin && req.IsAdmin == data["isAdmin"].(bool) {
		return true, nil
	}

	_, err = fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(user.ID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "isAdmin",
			Value: req.IsAdmin,
		},
	})

	return false, err
}

// Helpers

// fbUserToUserRecord combines a Firebase UserRecord and a Profile into a User
func fbUserToUserRecord(fbUser *firebaseAuth.UserRecord, profile *models.Profile) *models.User {
	// TODO: Refactor such that displayName, email, and profile photo are pulled from firebase auth and not the user profile stored in Firestore.
	return &models.User{
		ID:                 fbUser.UID,
		Profile:            profile,
		Disabled:           fbUser.Disabled,
		CreationTimestamp:  fbUser.UserMetadata.CreationTimestamp,
		LastLogInTimestamp: fbUser.UserMetadata.LastLogInTimestamp,
	}
}

// getUserCount returns the number of user profiles.
func (fr *FirebaseRepository) getUserCount() int {
	fr.profilesLock.RLock()
	defer fr.profilesLock.RUnlock()
	return len(fr.profiles)
}

func (fr *FirebaseRepository) createProfileFromFbUser(fbUser *firebaseAuth.UserRecord) (*models.Profile, error) {

	profile := &models.Profile{
		DisplayName:     fbUser.DisplayName,
		Email:           fbUser.Email,
		PhotoURL:        fbUser.PhotoURL,
		IsAdmin:         fr.getUserCount() == 0,
		Courses:         make([]string, 0),
		DefaultSections: make(map[string]string),
		ActualSections:  make(map[string]map[string]string),
		Permissions:     map[string]models.CoursePermission{},
		Notifications:   make([]models.Notification, 0),
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(fbUser.UID).Set(firebase.Context, profile)
	if err != nil {
		return nil, fmt.Errorf("error creating user profile: %v\n", err)
	}

	return profile, nil
}

func (fr *FirebaseRepository) executeInviteForUser(user *models.User) error {
	iter := fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Where("email", "==", user.Email).Documents(firebase.Context)
	for {
		// Get this document.
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		// Decode this document.
		var invite models.Invite
		err = mapstructure.Decode(doc.Data(), &invite)
		if err != nil {
			return err
		}

		if invite.CourseID != "" {
			if invite.Permission == models.CourseStudent {
				// Add as student
				course, _ := fr.GetCourseByID(invite.CourseID)
				// if course no longer exists, do nothing
				fr.addStudentToCourse(user, course)

			} else {
				// Add as staff
				_, err = fr.AddPermissions(&models.AddPermissionRequest{
					CourseID:   invite.CourseID,
					Email:      invite.Email,
					Permission: invite.Permission,
				})
				if err != nil {
					return err
				}
			}
		}
		if invite.IsAdmin {
			_, err = fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(user.ID).Update(firebase.Context, []firestore.Update{
				{
					Path:  "isAdmin",
					Value: true,
				},
			})
			if err != nil {
				return err
			}
		}
		// Delete the invite doc.
		_, err = doc.Ref.Delete(firebase.Context)
		return err

	}
	return nil
}

func (fr *FirebaseRepository) createCourseInvite(invite *models.Invite) (hadPermission bool, err error) {
	inviteID := models.CreateCourseInviteID(invite.Email, invite.CourseID)
	docRef := fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Doc(inviteID)
	// Check if invite with the same person and course exists
	doc, _ := docRef.Get(firebase.Context)
	if doc.Exists() {
		if doc.Data()["permission"].(string) == string(invite.Permission) {
			// invite already exists
			return true, nil
		}
		_, err := docRef.Update(firebase.Context, []firestore.Update{
			{
				Path:  "courseID",
				Value: invite.CourseID,
			},
			{
				Path:  "permission",
				Value: invite.Permission,
			},
		})
		return false, err
	}

	// create new invite
	_, err = docRef.Set(firebase.Context, invite)
	return false, err
}

func (fr *FirebaseRepository) removeCourseInvite(email string, courseID string) error {
	inviteID := models.CreateCourseInviteID(email, courseID)
	_, err := fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Doc(inviteID).Delete(firebase.Context)
	return err
}

func (fr *FirebaseRepository) createAdminInvite(req *models.EditAdminAccessRequest) (wasAdmin bool, err error) {
	inviteID := models.CreateSiteAdminInviteID(req.Email)
	docRef := fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Doc(inviteID)
	doc, _ := docRef.Get(firebase.Context)
	if doc.Exists() {
		// invite already exists
		return true, nil
	}
	_, err = fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Doc(inviteID).Set(firebase.Context, &models.Invite{
		Email:   req.Email,
		IsAdmin: req.IsAdmin,
	})
	return false, err
}

func (fr *FirebaseRepository) removeAdminInvite(req *models.EditAdminAccessRequest) error {
	inviteID := models.CreateSiteAdminInviteID(req.Email)
	_, err := fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Doc(inviteID).Delete(firebase.Context)
	return err
}
