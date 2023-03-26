package models

import "strings"

const (
	FirestoreCoursesCollection = "courses"
)

type Course struct {
	ID        string            `firestore:"id,omitempty"`
	Title     string            `firestore:"title"`
	Code      string            `firestore:"code"`
	Term      string            `firestore:"term"`
	EntryCode string            `firestore:"entryCode"`
	Students  map[string]string `firestore:"students,omitempty"`
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
	CourseID *string `json:"courseid,omitempty"`
	Title    *string `json:"title,omitempty"`
	Code     *string `json:"code,omitempty"`
	Term     *string `json:"term,omitempty"`
}

func CreateCourseID(req *CreateCourseRequest) string {
	return strings.ToLower(req.Code + req.Term)
}
