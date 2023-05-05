package models

import "time"

type NotificationType string

const (
	NotificationGradeUpdated         NotificationType = "Grade Updated"
	NotificationRequestUpdated       NotificationType = "Request Updated"
	NotificationSectionUpdated       NotificationType = "Section Update"
	NotificationSectionDeleted       NotificationType = "Section Deleted"
	NotificationNewSectionAssignment NotificationType = "New Section Assignment"
)

var NotificationMsg = map[NotificationType]string{
	NotificationGradeUpdated:         "You have a new grade!",
	NotificationRequestUpdated:       "Your request has been updated!",
	NotificationSectionUpdated:       "Your section has been updated. Please check your schedule.",
	NotificationSectionDeleted:       "Your section has been deleted. Please contact the instructor about next steps.",
	NotificationNewSectionAssignment: "Your have been assigned to a new section! Please check your schedule.",
}

type Notification struct {
	ID        string           `json:"id" firestore:"id"`
	Title     string           `json:"title" firestore:"title"`
	Body      string           `json:"body" firestore:"body"`
	Timestamp time.Time        `json:"timestamp" firestore:"timestamp"`
	Type      NotificationType `json:"type" firestore:"type"`
}
