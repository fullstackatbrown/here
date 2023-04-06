package repository

import (
	"fmt"
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
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
	fmt.Printf("sessioncookie %s", sessionCookie)
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

func (fr *FirebaseRepository) CreateUserProfile(req *models.CreateUserProfileRequest) (*models.Profile, error) {
	profile := &models.Profile{
		DisplayName:     req.DisplayName,
		Email:           req.Email,
		Access:          make(map[string]string),
		Courses:         make([]string, 0),
		DefaultSections: make(map[string]string),
		ActualSections:  make(map[string]map[string]string),
	}

	// TESTING ONLY
	profile.Access["rE3HqlVQ8dT1e1hwkN8I"] = "admin"

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Add(firebase.Context, profile)
	if err != nil {
		return nil, fmt.Errorf("error creating user profile: %v\n", err)
	}
	profile.ID = ref.ID

	return profile, nil

}

func (fr *FirebaseRepository) GetUserByID(id string) (*models.User, error) {
	// if err := utils.ValidateID(id); err != nil {
	// 	return nil, err
	// }

	// fbUser, err := fr.authClient.GetUser(firebase.Context, id)
	// if err != nil {
	// 	return nil, qerrors.UserNotFoundError
	// }

	// TODO: Refactor email verification into separate function.

	// Check the Firebase user's email against the list of allowed domains.
	// if len(config.Config.AllowedEmailDomains) > 0 {
	// 	domain := strings.Split(fbUser.Email, "@")[1]
	// 	if !utils.Contains(config.Config.AllowedEmailDomains, domain) {
	// 		// invalid email domain, delete the user from Firebase Auth
	// 		_ = fr.authClient.DeleteUser(firebase.Context, fbUser.UID)
	// 		return nil, qerrors.InvalidEmailError
	// 	}
	// }

	// profile, err := fr.getUserProfile(fbUser.UID)

	profile, err := fr.getProfileById(id)
	if err != nil {
		// TODO: no profile for the user found, create one.
		// fr.CreateUserProfile()
	}

	// return fbUserToUserRecord(fbUser, profile), nil
	return &models.User{Profile: profile}, nil
}

// getUserProfile gets the Profile from the userProfiles map corresponding to the provided user ID.
func (fr *FirebaseRepository) getProfileById(id string) (*models.Profile, error) {
	fr.profilesLock.RLock()
	defer fr.profilesLock.RUnlock()

	if val, ok := fr.profiles[id]; ok {
		return val, nil
	} else {
		return nil, fmt.Errorf("No profile found for ID %v\n", id)
	}
}

func (fr *FirebaseRepository) QuitCourse(req *models.QuitCourseRequest) error {
	// Check if course exists
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}

	batch := fr.firestoreClient.Batch()
	// Remove course for student
	userProfileRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.UserID)
	batch.Update(userProfileRef, []firestore.Update{
		{
			Path:  "courses",
			Value: firestore.ArrayRemove(course.ID),
		},
	})

	// remove student from course
	newStudentMap := utils.CopyStringMap(course.Students)
	delete(newStudentMap, req.UserID)

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

func (fr *FirebaseRepository) JoinCourse(req *models.JoinCourseRequest) (*models.Course, error) {

	fmt.Println(req.EntryCode)
	// Check if course exists
	course, err := fr.GetCourseByEntryCode(req.EntryCode)
	fmt.Println(course, err)
	if err != nil {
		return nil, err
	}

	// Check if already enrolled
	profile, err := fr.getProfileById(req.UserID)
	if err != nil {
		return nil, err
	}

	if utils.Contains(profile.Courses, course.ID) {
		return nil, fmt.Errorf("Student is already enrolled in course")
	}

	batch := fr.firestoreClient.Batch()
	// Add course to student
	userProfileRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.UserID)
	batch.Update(userProfileRef, []firestore.Update{
		{
			Path:  "courses",
			Value: firestore.ArrayUnion(course.ID),
		},
	})

	// Add student to course
	newStudentMap := utils.CopyStringMap(course.Students)
	newStudentMap[req.UserID] = ""

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
		return nil, err
	}

	return course, nil

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
