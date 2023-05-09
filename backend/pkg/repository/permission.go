package repository

import (
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/fullstackatbrown/here/pkg/utils"
)

func (fr *FirebaseRepository) AddPermissions(req *models.AddPermissionRequest) (exists bool, badReq error, err error) {
	if req.Permission == models.CourseAdmin || req.Permission == models.CourseStaff {
		// Get user by email.
		user, err := fr.GetUserByEmail(req.Email)
		if err != nil {
			// The user doesn't exist; add an invite to the invites collection and then return.
			exists, badReq, err := fr.createCourseInvite(&models.Invite{
				Email:      req.Email,
				CourseID:   req.CourseID,
				Permission: req.Permission,
			})
			return exists, badReq, err
		}

		// check if the user already has permission
		course, err := fr.GetCourseByID(req.CourseID)
		if err != nil {
			return false, nil, err
		}

		perm, ok := course.Permissions[user.ID]
		if ok {
			if perm == req.Permission {
				return true, nil, nil
			}
			return false, qerrors.PermissionExistsError(perm), nil
		}

		// check if the user is already a student
		if _, ok := course.Students[user.ID]; ok {
			// TODO: return bad request error
			return false, qerrors.EnrolledAsStudentError, nil
		}

		batch := fr.firestoreClient.Batch()

		// Set course-side permissions.
		batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID), []firestore.Update{
			{
				Path:  "permissions." + user.ID,
				Value: req.Permission,
			},
		})

		// Set user-side permissions.
		batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(user.ID), []firestore.Update{
			{
				Path:  "permissions." + req.CourseID,
				Value: req.Permission,
			},
		})

		// Commit the batch.
		_, err = batch.Commit(firebase.Context)
		if err != nil {
			return false, nil, err
		}

	}
	return false, nil, nil
}

func (fr *FirebaseRepository) DeletePermission(req *models.DeletePermissionRequest) error {
	// For existing user
	if req.UserID != "" {
		batch := fr.firestoreClient.Batch()

		batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID), []firestore.Update{
			{
				Path:  "permissions." + req.UserID,
				Value: firestore.Delete,
			},
		})

		batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.UserID), []firestore.Update{
			{
				Path:  "permissions." + req.CourseID,
				Value: firestore.Delete,
			},
		})

		// Commit the batch.
		_, err := batch.Commit(firebase.Context)

		return err
	}

	// For invites
	if req.Email != "" {
		err := fr.removeCourseInvite(req.Email, req.CourseID)
		return err
	}

	return fmt.Errorf("no user or email specified")
}

func (fr *FirebaseRepository) AddStudentToCourse(req *models.AddStudentRequest) (exists bool, badReq error, err error) {
	user, err := fr.GetUserByEmail(req.Email)

	if err != nil {
		// No user from this email yet, add invite
		exists, badReq, err := fr.createCourseInvite(&models.Invite{
			Email:      req.Email,
			CourseID:   req.CourseID,
			Permission: models.CourseStudent,
		})
		// overrides previous invite
		return exists, badReq, err
	} else {
		// User exists, add to course
		course, err := fr.GetCourseByID(req.CourseID)
		if err != nil {
			return false, nil, err
		}
		return fr.addStudentToCourse(user, course)
	}
}

func (fr *FirebaseRepository) DeleteStudentFromCourse(req *models.DeleteStudentRequest) error {
	if req.UserID != "" {
		err := fr.deleteStudentFromCourse(req.UserID, req.Course)
		if err != nil {
			return err
		}
		return nil
	}

	if req.Email != "" {
		// delete invite
		err := fr.removeCourseInvite(req.Email, req.Course.ID)
		if err != nil {
			return err
		}
		return nil
	}

	return fmt.Errorf("no user or email specified")
}

// Helpers

func (fr *FirebaseRepository) addStudentToCourse(user *models.User, course *models.Course) (exists bool, badReq error, err error) {

	// Check if student is already in course
	_, ok := course.Students[user.ID]
	if ok {
		return true, nil, nil
	}

	// Check if student is already a staff
	perm, ok := course.Permissions[user.ID]
	if ok {
		return false, qerrors.PermissionExistsError(perm), nil
	}

	batch := fr.firestoreClient.Batch()
	// Add course to student
	userProfileRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(user.ID)
	batch.Update(userProfileRef, []firestore.Update{
		{
			Path:  "courses",
			Value: firestore.ArrayUnion(course.ID),
		},
	})

	// Add student to course
	newStudentMap := utils.CopyMap(course.Students)
	newStudentMap[user.ID] = models.CourseUserData{
		StudentID:   user.ID,
		Email:       user.Email,
		DisplayName: user.DisplayName,
	}

	coursesRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(course.ID)
	batch.Update(coursesRef, []firestore.Update{
		{
			Path:  "students",
			Value: newStudentMap,
		},
	})

	// Commit the batch.
	_, err = batch.Commit(firebase.Context)
	return false, nil, err
}

// 1. Remove course from student (courses, defaultSections, actualSections)
// 2. Remove student from course
// 3. Remove student from section, if exists
// Student grades are kept
func (fr *FirebaseRepository) deleteStudentFromCourse(userID string, course *models.Course) error {
	// check if the student is previously enrolled in any section
	profile, err := fr.GetProfileById(userID)
	if err != nil {
		return err
	}
	defaultSection, hadOldSection := profile.DefaultSections[course.ID]

	batch := fr.firestoreClient.Batch()
	// remove course from student
	userProfileRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(userID)
	batch.Update(userProfileRef, []firestore.Update{
		{
			Path:  "courses",
			Value: firestore.ArrayRemove(course.ID),
		},
		{
			Path:  "defaultSections." + course.ID,
			Value: firestore.Delete,
		},
		{
			Path:  "actualSections." + course.ID,
			Value: firestore.Delete,
		},
	})

	// remove student from course
	coursesRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(course.ID)
	batch.Update(coursesRef, []firestore.Update{
		{
			Path:  "students." + userID,
			Value: firestore.Delete,
		},
	})

	if hadOldSection {
		// decrement section enrolled count
		sectionRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(course.ID).
			Collection(models.FirestoreSectionsCollection).Doc(defaultSection)

		batch.Update(sectionRef, []firestore.Update{
			{
				Path:  "numEnrolled",
				Value: firestore.Increment(-1),
			},
		})
	}

	// For all surveys in course, remove student response
	course.SurveysLock.RLock()
	for _, survey := range course.Surveys {
		surveyRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(course.ID).
			Collection(models.FirestoreSurveysCollection).Doc(survey.ID)

		batch.Update(surveyRef, []firestore.Update{
			{
				Path:  "responses." + userID,
				Value: firestore.Delete,
			},
		})
	}
	course.SurveysLock.RUnlock()

	// Commit the batch.
	_, err = batch.Commit(firebase.Context)
	if err != nil {
		return err
	}

	return nil
}
