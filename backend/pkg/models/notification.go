package models

import "time"

type NotificationType string

const (
	NotificationReleaseGrades  NotificationType = "RELEASE_GRADES"
	NotificationRequestUpdated NotificationType = "REQUEST_UPDATED"
	NotificationAnnouncement   NotificationType = "ANNOUNCEMENT"
)

type Notification struct {
	ID        string           `json:"id" mapstructure:"id"`
	Title     string           `json:"title" mapstructure:"title"`
	Body      string           `json:"body" mapstructure:"body"`
	Timestamp time.Time        `json:"timestamp" mapstructure:"timestamp"`
	Type      NotificationType `json:"type" mapstructure:"type"`
}

// ClearNotificationRequest is the parameter struct for the ClearNotification function.
type ClearNotificationRequest struct {
	UserID         string `json:",omitempty"`
	NotificationID string `json:"notificationId" mapstructure:"notificationId"`
}

// ClearAllNotificationsRequest is the parameter struct for the ClearNotification function.
type ClearAllNotificationsRequest struct {
	UserID string `json:",omitempty"`
}
