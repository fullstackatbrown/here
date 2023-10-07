package models

import (
	"fmt"

	"github.com/fullstackatbrown/here/pkg/firebase"
	pal "github.com/tianrendong/privacy-pal"
)

const (
	FirestoreProfilesCollection = "user_profiles"
)

type CoursePermission string

const (
	CourseAdmin   CoursePermission = "admin"
	CourseStaff   CoursePermission = "staff"
	CourseStudent CoursePermission = "student"
)

type Invite struct {
	Email      string           `firestore:"email"`
	CourseID   string           `firestore:"courseID,omitempty"`
	Permission CoursePermission `firestore:"permission,omitempty"`
	IsAdmin    bool             `firestore:"isAdmin,omitempty"`
}

func CreateCourseInviteID(email string, courseID string) string {
	return fmt.Sprintf("%s,%s", email, courseID)
}

func CreateSiteAdminInviteID(email string) string {
	return fmt.Sprintf("%s,siteadmin", email)
}

// Profile is a collection of standard profile information for a user.
// This struct separates client-safe profile information from internal user metadata.
type Profile struct {
	ID              string                       `json:"id" firestore:"id,omitempty"`
	DisplayName     string                       `json:"displayName" firestore:"displayName"`
	Email           string                       `json:"email" firestore:"email"`
	PhotoURL        string                       `json:"photoUrl" firestore:"photoUrl"`
	Courses         []string                     `json:"courses" firestore:"courses"`
	DefaultSections map[string]string            `json:"defaultSections" firestore:"defaultSections"`
	ActualSections  map[string]map[string]string `json:"actualSections" firestore:"actualSections"`
	IsAdmin         bool                         `json:"isAdmin" firestore:"isAdmin"`
	Permissions     map[string]CoursePermission  `json:"permissions" firestore:"permissions"` // map from courseID to permission
	Notifications   []Notification               `json:"notifications" firestore:"notifications"`
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

func (u *User) Owns() []pal.Locator {
	return []pal.Locator{{
		ID:         "45UwrbxU9caxNqI5caWdxPYJ8pO2",
		Collection: FirestoreProfilesCollection,
		Document:   &Profile{},
	}}
}

func (u *User) Accesses() []pal.Locator {
	return []pal.Locator{}
}

func (u *User) GetData(mode pal.GetDataMode) string {
	return ""
}

func (p *Profile) Owns() []pal.Locator {
	return []pal.Locator{}
}

func (p *Profile) Accesses() []pal.Locator {
	return []pal.Locator{}
}

func (p *Profile) GetData(mode pal.GetDataMode) string {
	return p.DisplayName
}

func init() {
	user := &User{}
	firestoreClient, err := firebase.App.Firestore(firebase.Context)
	if err != nil {
		panic(err.Error())
	}
	f := pal.NewPrivacyPal(firestoreClient)
	fmt.Println(f.ProcessAccessRequest(user))
}
