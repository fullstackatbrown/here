package models

import (
	"strings"
	"sync"

	"cloud.google.com/go/firestore"
	pal "github.com/privacy-pal/privacy-pal/pkg"
)

const (
	FirestoreCoursesCollection = "courses"
	FirestoreInvitesCollection = "invites"
)

var CourseFieldsToExclude = []string{
	"Sections", "SectionsLock", "SectionsListenerCancelFunc",
	"Assignments", "AssignmentsLock", "AssignmentsListenerCancelFunc",
	"PendingSwaps", "PendingSwapsLock", "PendingSwapsListenerCancelFunc",
	"Surveys", "SurveysLock", "SurveysListenerCancelFunc",
}

type Course struct {
	ID          string                      `firestore:"id,omitempty"`
	Title       string                      `firestore:"title"`
	Code        string                      `firestore:"code"`
	Term        string                      `firestore:"term"`
	EntryCode   string                      `firestore:"entryCode"`
	Status      CourseStatus                `firestore:"status"`
	Config      CourseConfig                `firestore:"config"`
	Students    map[string]CourseUserData   `firestore:"students"`    // map from userID to student data
	Permissions map[string]CoursePermission `firestore:"permissions"` // map from userID to permission

	SectionsLock               sync.RWMutex        `firestore:"-"`
	Sections                   map[string]*Section `firestore:"-"`
	SectionsListenerCancelFunc func()              `firestore:"-"`

	AssignmentsLock               sync.RWMutex           `firestore:"-"`
	Assignments                   map[string]*Assignment `firestore:"-"`
	AssignmentsListenerCancelFunc func()                 `firestore:"-"`

	SurveysLock               sync.RWMutex       `firestore:"-"`
	Surveys                   map[string]*Survey `firestore:"-"`
	SurveysListenerCancelFunc func()             `firestore:"-"`

	PendingSwapsLock               sync.RWMutex     `firestore:"-"`
	PendingSwaps                   map[string]*Swap `firestore:"-"`
	PendingSwapsListenerCancelFunc func()           `firestore:"-"`
}

type CourseStatus string

const (
	CourseArchived CourseStatus = "archived"
	CourseInactive CourseStatus = "inactive"
	CourseActive   CourseStatus = "active"
)

type CourseUserData struct {
	StudentID      string `firestore:"studentID"`
	Email          string `firestore:"email"`
	DisplayName    string `firestore:"displayName"`
	DefaultSection string `firestore:"defaultSection,omitempty"`
}

type CourseConfig struct {
	AutoApproveRequests         bool `firestore:"autoApproveRequests"`
	SharePeopleListWithStudents bool `firestore:"sharePeopleListWithStudents"`
}

type GetCourseRequest struct {
	CourseID string `json:"courseid"`
}

type CreateCourseRequest struct {
	Title string `json:"title"`
	Code  string `json:"code"`
	Term  string `json:"term"`
}

type DeleteCourseRequest struct {
	CourseID string `json:"courseid"`
}

type UpdateCourseRequest struct {
	CourseID            *string       `json:"courseid,omitempty"`
	Title               *string       `json:"title,omitempty"`
	Status              *CourseStatus `json:"status"`
	AutoApproveRequests *bool         `json:"autoApproveRequests,omitempty"`
	Config              *CourseConfig `json:"config,omitempty"`
}

type UpdateCourseInfoRequest struct {
	CourseID *string `json:"courseid,omitempty"`
	Title    *string `json:"title,omitempty"`
	Code     *string `json:"code,omitempty"`
	Term     *string `json:"term,omitempty"`
}

type AssignSectionsRequest struct {
	Course       *Course `json:"course,omitempty"`
	StudentID    string  `json:"studentID"`
	OldSectionID string  `json:"oldSectionID,omitempty"`
	NewSectionID string  `json:"newSectionID,omitempty"`
	AssignmentID string  `json:"assignmentID,omitempty"`
}

func CreateCourseID(req *CreateCourseRequest) string {
	return strings.ToLower(req.Code + req.Term)
}

func (c *Course) HandleAccess(dataSubjectID string, currentDocumentID string) map[string]interface{} {
	data := make(map[string]interface{})
	data["title"] = c.Title
	data["course user data"] = c.Students[dataSubjectID]
	if c.Students[dataSubjectID].DefaultSection != "" {
		data["default section"] = []pal.Locator{
			{
				Type:           pal.Document,
				DocIDs:         []string{currentDocumentID, c.Students[dataSubjectID].DefaultSection},
				CollectionPath: []string{FirestoreCoursesCollection, FirestoreSectionsCollection},
				NewDataNode:    func() pal.DataNode { return &Section{} },
			},
		}
	} else {
		data["default section"] = "unassigned"
	}
	return data
}

func (c *Course) HandleDeletion(dataSubjectID string) (nodesToTraverse []pal.Locator, deleteNode bool, fieldsToUpdate []firestore.Update) {
	return
}
