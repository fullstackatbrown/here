package models

import "strings"

const (
	FirestoreCoursesCollection = "courses"
)

type Course struct {
	ID                  string                    `firestore:"id,omitempty"`
	Title               string                    `firestore:"title"`
	Code                string                    `firestore:"code"`
	Term                string                    `firestore:"term"`
	EntryCode           string                    `firestore:"entryCode"`
	AutoApproveRequests bool                      `firestore:"autoApproveRequests"`
	Students            map[string]CourseUserData `firestore:"students,omitempty"`
}

type CourseUserData struct {
	StudentID      string `firestore:"studentID"`
	Email          string `firestore:"email"`
	DisplayName    string `firestore:"displayName"`
	Pronouns       string `firestore:"pronouns"`
	DefaultSection string `firestore:"defaultSection"`
}

type GetCourseRequest struct {
	CourseID string `json:"courseid"`
}

type CreateCourseRequest struct {
	Title               string `json:"title"`
	Code                string `json:"code"`
	Term                string `json:"term"`
	AutoApproveRequests bool   `json:"autoApproveRequests,omitempty"`
}

type DeleteCourseRequest struct {
	CourseID string `json:"courseid"`
}

type UpdateCourseRequest struct {
	CourseID            *string `json:"courseid,omitempty"`
	Title               *string `json:"title,omitempty"`
	Code                *string `json:"code,omitempty"`
	Term                *string `json:"term,omitempty"`
	AutoApproveRequests *bool   `json:"autoApproveRequests,omitempty"`
}

func CreateCourseID(req *CreateCourseRequest) string {
	return strings.ToLower(req.Code + req.Term)
}
