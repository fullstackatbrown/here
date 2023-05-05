package models

import "time"

type NotificationType string

const (
	NotificationGradeUpdated   NotificationType = "RELEASE_GRADES"
	NotificationRequestUpdated NotificationType = "REQUEST_UPDATED"
	NotificationAnnouncement   NotificationType = "ANNOUNCEMENT"
	NotificationSectionUpdate  NotificationType = "SECTION_UPDATED"
	NotificationSectionDelete  NotificationType = "SECTION_DELETED"
)

type Notification struct {
	ID        string           `json:"id" firestore:"id"`
	Title     string           `json:"title" firestore:"title"`
	Body      string           `json:"body" firestore:"body"`
	Timestamp time.Time        `json:"timestamp" firestore:"timestamp"`
	Type      NotificationType `json:"type" firestore:"type"`
}
