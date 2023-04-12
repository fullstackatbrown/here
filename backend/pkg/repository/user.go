package repository

import (
	"fmt"
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/mitchellh/mapstructure"

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

	done := make(chan bool)
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

	// TODO: email verification

	profile, err := fr.GetProfileById(fbUser.UID)
	if err != nil {
		// TODO: no profile for the user found, create one.
		// fr.CreateUserProfile()
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
	return data["ID"].(string), nil
}

func (fr *FirebaseRepository) ValidateJoinCourseRequest(req *models.JoinCourseRequest) (course *models.Course, internalError error, requestError error) {
	// Check if course exists
	course, err := fr.GetCourseByEntryCode(req.EntryCode)
	if err != nil {
		return nil, nil, err
	}

	// Check if course is active
	if course.Status != models.CourseActive {
		return nil, nil, fmt.Errorf("Cannot join an inactive or archived course")
	}

	// Check if already enrolled
	profile, err := fr.GetProfileById(req.User.ID)
	if err != nil {
		return nil, err, nil
	}

	if utils.Contains(profile.Courses, course.ID) {
		return nil, nil, fmt.Errorf("Student is already enrolled in course")
	}

	return course, nil, nil
}

func (fr *FirebaseRepository) JoinCourse(req *models.JoinCourseRequest, course *models.Course) (*models.Course, error) {
	batch := fr.firestoreClient.Batch()
	// Add course to student
	userProfileRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.User.ID)
	batch.Update(userProfileRef, []firestore.Update{
		{
			Path:  "courses",
			Value: firestore.ArrayUnion(course.ID),
		},
	})

	// Add student to course
	newStudentMap := utils.CopyMap(course.Students)
	newStudentMap[req.User.ID] = models.CourseUserData{
		StudentID:   req.User.ID,
		Email:       req.User.Email,
		DisplayName: req.User.DisplayName,
		Pronouns:    req.User.Pronouns,
	}

	coursesRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(course.ID)
	batch.Update(coursesRef, []firestore.Update{
		{
			Path:  "students",
			Value: newStudentMap,
		},
	})

	// Commit the batch.
	_, err := batch.Commit(firebase.Context)
	if err != nil {
		return nil, err
	}

	return course, nil
}

func (fr *FirebaseRepository) QuitCourse(req *models.QuitCourseRequest) error {
	// Check if course exists
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}

	batch := fr.firestoreClient.Batch()
	// Remove course for student
	userProfileRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.User.ID)
	batch.Update(userProfileRef, []firestore.Update{
		{
			Path:  "courses",
			Value: firestore.ArrayRemove(course.ID),
		},
	})

	// remove student from course
	newStudentMap := utils.CopyMap(course.Students)
	delete(newStudentMap, req.User.ID)

	coursesRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(course.ID)
	batch.Update(coursesRef, []firestore.Update{
		{
			Path:  "students",
			Value: newStudentMap,
		},
	})

	// Commit the batch.
	_, err = batch.Commit(firebase.Context)
	if err != nil {
		return err
	}

	return nil
}

func (fr *FirebaseRepository) EditAdminAccess(req *models.EditAdminAccessRequest) error {
	user, err := fr.GetUserByEmail(req.Email)
	if err != nil {
		return err
	}

	// TODO: handle the case where user has not logged in before

	_, err = fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(user.ID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "isAdmin",
			Value: req.IsAdmin,
		},
	})

	return err
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
