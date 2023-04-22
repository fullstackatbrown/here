package models

import "time"

type NotificationType string

const (
	NotificationGradeUpdated   NotificationType = "RELEASE_GRADES"
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
