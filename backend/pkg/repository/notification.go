package repository

import (
	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/google/uuid"
)

func (fr *FirebaseRepository) AddNotification(userID string, notification models.Notification) error {
	notification.ID = uuid.New().String()
	_, err := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(userID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "notifications",
			Value: firestore.ArrayUnion(notification),
		},
	})

	return err
}

func (fr *FirebaseRepository) ClearNotification(c *models.ClearNotificationRequest) error {
	user, err := fr.GetUserByID(c.UserID)
	if err != nil {
		return err
	}

	newNotifications := make([]models.Notification, 0)
	for _, v := range user.Notifications {
		if v.ID != c.NotificationID {
			newNotifications = append(newNotifications, v)
		}
	}
	_, err = fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(c.UserID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "notifications",
			Value: newNotifications,
		},
	})
	return err
}

func (fr *FirebaseRepository) ClearAllNotifications(c *models.ClearAllNotificationsRequest) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(c.UserID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "notifications",
			Value: make([]models.Notification, 0),
		},
	})
	return err
}
