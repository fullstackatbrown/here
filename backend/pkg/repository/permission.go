package repository

import (
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
)

func (fr *FirebaseRepository) CreatePermissions(req *models.AddPermissionsRequest) error {

	for _, permission := range req.Permissions {
		// Get user by email.
		user, err := fr.GetUserByEmail(permission.Email)
		if err != nil {
			// The user doesn't exist; add an invite to the invites collection and then return.
			_, _, err = fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Add(firebase.Context, map[string]interface{}{
				"email":      permission.Email,
				"courseID":   req.CourseID,
				"permission": permission.Permission,
			})
			return err
		}

		batch := fr.firestoreClient.Batch()

		// Set course-side permissions.
		batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID), []firestore.Update{
			{
				Path:  "permissions." + user.ID,
				Value: permission.Permission,
			},
		})

		// Set user-side permissions.
		batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(user.ID), []firestore.Update{
			{
				Path:  "permissions." + req.CourseID,
				Value: permission.Permission,
			},
		})

		// Commit the batch.
		_, err = batch.Commit(firebase.Context)
		if err != nil {
			return fmt.Errorf("Errored when setting permission for user %s: %v", user.ID, err)
		}
	}

	return nil
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
