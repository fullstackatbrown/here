package models

import (
	"net/http"
	"strings"
	"sync"
)

const (
	FirestoreCoursesCollection = "courses"
	FirestoreInvitesCollection = "invites"
)

var CourseFieldsToExclude = []string{
	"Sections", "SectionsLock", "SectionsListenerCancelFunc",
	"Assignments", "AssignmentsLock", "AssignmentsListenerCancelFunc",
	"PendingSwaps", "PendingSwapsLock", "PendingSwapsListenerCancelFunc",
}

type Course struct {
	ID                  string                      `firestore:"id,omitempty"`
	Title               string                      `firestore:"title"`
	Code                string                      `firestore:"code"`
	Term                string                      `firestore:"term"`
	EntryCode           string                      `firestore:"entryCode"`
	Status              CourseStatus                `firestore:"status"`
	AutoApproveRequests bool                        `firestore:"autoApproveRequests"`
	Students            map[string]CourseUserData   `firestore:"students,omitempty"`    // map from userID to student data
	Permissions         map[string]CoursePermission `firestore:"permissions,omitempty"` // map from userID to permission

	SectionsLock               sync.RWMutex        `firestore:"-"`
	Sections                   map[string]*Section `firestore:"-"`
	SectionsListenerCancelFunc func()              `firestore:"-"`

	AssignmentsLock               sync.RWMutex           `firestore:"-"`
	Assignments                   map[string]*Assignment `firestore:"-"`
	AssignmentsListenerCancelFunc func()                 `firestore:"-"`

	PendingSwapsLock               sync.RWMutex     `firestore:"-"`
	PendingSwaps                   map[string]*Swap `firestore:"-"`
	PendingSwapsListenerCancelFunc func()           `firestore:"-"`

	GapiRefreshToken string       `firestore:"gapiRefreshToken,omitempty"`
	GapiAccessToken  string       `firestore:"gapiAccessToken,omitempty"`
	GapiClient       *http.Client `firestore:"-"`
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
	DefaultSection string `firestore:"defaultSection"`
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
}

type UpdateCourseInfoRequest struct {
	CourseID *string `json:"courseid,omitempty"`
	Title    *string `json:"title,omitempty"`
	Code     *string `json:"code,omitempty"`
	Term     *string `json:"term,omitempty"`
}

type AssignSectionsRequest struct {
	CourseID     string `json:"courseID,omitempty"`
	StudentID    string `json:"studentID"`
	OldSectionID string `json:"oldSectionID,omitempty"`
	NewSectionID string `json:"newSectionID,omitempty"`
	AssignmentID string `json:"assignmentID,omitempty"`
}

func CreateCourseID(req *CreateCourseRequest) string {
	return strings.ToLower(req.Code + req.Term)
}
