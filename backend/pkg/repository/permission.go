package repository

import (
	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
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
