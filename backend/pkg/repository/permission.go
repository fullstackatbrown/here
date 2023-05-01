package repository

import (
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/utils"
)

func (fr *FirebaseRepository) AddPermissions(req *models.AddPermissionRequest) (hadPermission bool, err error) {
	if req.Permission == models.CourseAdmin || req.Permission == models.CourseStaff {
		// Get user by email.
		user, err := fr.GetUserByEmail(req.Email)
		if err != nil {
			// The user doesn't exist; add an invite to the invites collection and then return.
			hadPermission, err := fr.createCourseInvite(&models.Invite{
				Email:      req.Email,
				CourseID:   req.CourseID,
				Permission: req.Permission,
			})
			return hadPermission, err
		}

		// check if the user already has permission
		course, err := fr.GetCourseByID(req.CourseID)
		if err != nil {
			return false, err
		}

		perm, ok := course.Permissions[user.ID]
		if ok && perm == req.Permission {
			return true, nil
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
			return false, err
		}

	}
	return false, nil
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

func (fr *FirebaseRepository) AddStudentToCourse(req *models.AddStudentRequest) (studentExists bool, studentIsStaff bool, err error) {
	user, err := fr.GetUserByEmail(req.Email)

	if err != nil {
		// No user from this email yet, add invite
		studentExists, err := fr.createCourseInvite(&models.Invite{
			Email:      req.Email,
			CourseID:   req.CourseID,
			Permission: models.CourseStudent,
		})
		// overrides previous invite
		return studentExists, false, err
	} else {
		// User exists, add to course
		course, err := fr.GetCourseByID(req.CourseID)
		if err != nil {
			return false, false, err
		}
		studentExists, studentIsStaff, err = fr.addStudentToCourse(user, course)
		if (studentExists || studentIsStaff) && err == nil {
			return studentExists, studentIsStaff, err
		}
	}
	return false, false, nil
}

func (fr *FirebaseRepository) DeleteStudentFromCourse(req *models.DeleteStudentRequest) error {
	if req.UserID != "" {
		err := fr.deleteStudentFromCourse(req.UserID, req.CourseID)
		if err != nil {
			return err
		}
		return nil
	}

	if req.Email != "" {
		// delete invite
		err := fr.removeCourseInvite(req.Email, req.CourseID)
		if err != nil {
			return err
		}
		return nil
	}

	return fmt.Errorf("no user or email specified")
}

// Helpers

func (fr *FirebaseRepository) addStudentToCourse(user *models.User, course *models.Course) (studentExists bool, studentIsStaff bool, err error) {

	// Check if student is already in course
	_, ok := course.Students[user.ID]
	if ok {
		return true, false, nil
	}

	// Check if student is already a staff
	_, ok = course.Permissions[user.ID]
	if ok {
		return false, true, nil
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
	if err != nil {
		return false, false, err
	}

	return false, false, nil
}

func (fr *FirebaseRepository) deleteStudentFromCourse(userID string, courseID string) error {
	// TODO: delete other user data

	batch := fr.firestoreClient.Batch()
	// Remove course for student
	userProfileRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(userID)
	batch.Update(userProfileRef, []firestore.Update{
		{
			Path:  "courses",
			Value: firestore.ArrayRemove(courseID),
		},
	})

	// remove student from course
	coursesRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID)
	batch.Update(coursesRef, []firestore.Update{
		{
			Path:  "students." + userID,
			Value: firestore.Delete,
		},
	})

	// Commit the batch.
	_, err := batch.Commit(firebase.Context)
	if err != nil {
		return err
	}

	return nil
}
