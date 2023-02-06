package models

import "time"

const (
	FirestoreUserProfilesCollection = "user_profiles"
)

type CoursePermission string

const (
	CourseAdmin CoursePermission = "ADMIN"
	CourseStaff CoursePermission = "STAFF"
)

type NotificationType string

const (
	NotificationClaimed      NotificationType = "CLAIMED"
	NotificationComplete     NotificationType = "COMPLETE"
	NotificationAnnouncement NotificationType = "ANNOUNCEMENT"
)

// Profile is a collection of standard profile information for a user.
// This struct separates client-safe profile information from internal user metadata.
type Profile struct {
	DisplayName string
	Email       string
	PhoneNumber string
	PhotoURL    string
	IsAdmin     bool
	Pronouns    string
	MeetingLink string
	// Map from course ID to CoursePermission
	CoursePermissions map[string]CoursePermission
	Notifications     []Notification
}

// User represents a registered user.
type User struct {
	*Profile
	ID                 string
	Disabled           bool
	CreationTimestamp  int64
	LastLogInTimestamp int64
}

type Notification struct {
	ID        string           `json:"id" mapstructure:"id"`
	Title     string           `json:"title" mapstructure:"title"`
	Body      string           `json:"body" mapstructure:"body"`
	Timestamp time.Time        `json:"timestamp" mapstructure:"timestamp"`
	Type      NotificationType `json:"type" mapstructure:"type"`
}

// CreateUserRequest is the parameter struct for the CreateUser function.
type CreateUserRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
}

// UpdateUserRequest is the parameter struct for the UpdateUser function.
type UpdateUserRequest struct {
	// Will be set from context
	UserID      string `json:",omitempty"`
	DisplayName string `json:"displayName"`
	Pronouns    string `json:"pronouns"`
	MeetingLink string `json:"meetingLink"`
}

// MakeAdminByEmailRequest is the parameter struct for the MakeAdminByEmail function.
type MakeAdminByEmailRequest struct {
	Email   string `json:"email"`
	IsAdmin bool   `json:"isAdmin"`
}

type Student struct {
	Courses []string
}
