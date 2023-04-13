package models

const (
	FirestoreProfilesCollection = "user_profiles"
)

type CoursePermission string

const (
	CourseAdmin CoursePermission = "admin"
	CourseStaff CoursePermission = "staff"
)

// Profile is a collection of standard profile information for a user.
// This struct separates client-safe profile information from internal user metadata.
type Profile struct {
	ID              string                       `json:"id" firestore:"id,omitempty"`
	DisplayName     string                       `json:"displayName" firestore:"displayName"`
	Email           string                       `json:"email" firestore:"email"`
	Pronouns        string                       `json:"pronouns" firestore:"pronouns"`
	PhotoURL        string                       `json:"photoUrl" firestore:"photoUrl"`
	Courses         []string                     `json:"courses" firestore:"courses"`
	DefaultSections map[string]string            `json:"defaultSections" firestore:"defaultSections"`
	ActualSections  map[string]map[string]string `json:"actualSections" firestore:"actualSections"`
	IsAdmin         bool                         `json:"isAdmin" firestore:"isAdmin"`
	Permissions     map[string]CoursePermission  `json:"permissions" firestore:"permissions"` // map from courseID to permission
}

type User struct {
	*Profile
	ID                 string `json:"ID"`
	Disabled           bool
	CreationTimestamp  int64
	LastLogInTimestamp int64
}

type CreateUserRequest struct {
	Email       string `json:"email"`
	DisplayName string `json:"displayName"`
	Password    string `json:"password"`
}

type JoinCourseRequest struct {
	User      *User  `json:"user,omitempty"`
	EntryCode string `json:"entryCode"`
}

type QuitCourseRequest struct {
	User     *User  `json:"user,omitempty"`
	CourseID string `json:"courseID"`
}

type EditAdminAccessRequest struct {
	Email   string `json:"email"`
	IsAdmin bool   `json:"isAdmin"`
}
