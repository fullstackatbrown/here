package models

const (
	FirestoreProfilesCollection = "user_profiles"
)

type CoursePermission string

const (
	CourseAdmin CoursePermission = "ADMIN"
	CourseStaff CoursePermission = "STAFF"
)

// Profile is a collection of standard profile information for a user.
// This struct separates client-safe profile information from internal user metadata.
type Profile struct {
	ID              string                       `firestore:"id,omitempty"`
	DisplayName     string                       `firestore:"displayName"`
	Email           string                       `firestore:"email"`
	Pronouns        string                       `firestore:"pronouns"`
	PhotoURL        string                       `firestore:"photoUrl"`
	Courses         []string                     `firestore:"courses"`
	DefaultSections map[string]string            `firestore:"defaultSections"`
	ActualSections  map[string]map[string]string `firestore:"actualSections"`
	IsAdmin         bool                         `firestore:"isAdmin"`
	Permissions     map[string]CoursePermission  `firestore:"permissions"` // map from courseID to permission
}

type User struct {
	*Profile
	ID                 string
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
