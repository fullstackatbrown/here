package models

type ActionType string

const (
	FirestoreProfilesCollection            = "user_profiles"
	ACTION_JOIN                 ActionType = "JOIN"
	ACTION_QUIT                 ActionType = "QUIT"
)

// Profile is a collection of standard profile information for a user.
// This struct separates client-safe profile information from internal user metadata.
type Profile struct {
	ID              string                       `firestore:"id,omitempty"`
	DisplayName     string                       `firestore:"displayName"`
	Email           string                       `firestore:"email"`
	Pronouns        string                       `firestore:"pronouns"`
	Access          map[string]string            `firestore:"access"`
	Courses         []string                     `firestore:"courses"`
	DefaultSections map[string]string            `firestore:"defaultSections"`
	ActualSections  map[string]map[string]string `firestore:"actualSections"`
}

type User struct {
	*Profile
	ID                 string `json:"id" mapstructure:"id"`
	Disabled           bool
	CreationTimestamp  int64
	LastLogInTimestamp int64
}

type CreateUserProfileRequest struct {
	Email       string `json:"email"`
	DisplayName string `json:"displayName"`
}

type JoinCourseRequest struct {
	User      *Profile `json:"user,omitempty"`
	EntryCode string   `json:"entryCode"`
}

type QuitCourseRequest struct {
	UserID   string `json:"userID,omitempty"`
	CourseID string `json:"courseID"`
}
