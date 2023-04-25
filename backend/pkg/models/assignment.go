package models

import "time"

const (
	FirestoreAssignmentsCollection = "assignments"
)

type Assignment struct {
	ID          string           `firestore:"id,omitempty"`
	CourseID    string           `firestore:"courseID"`
	Name        string           `firestore:"name"`
	Optional    bool             `firestore:"optional"`
	MaxScore    int              `firestore:"maxScore"`
	ReleaseDate time.Time        `firestore:"releaseDate"`
	DueDate     time.Time        `firestore:"dueDate"`
	Grades      map[string]Grade `firestore:"grades"` // map[studentID]Grade
}

type GetAssignmentRequest struct {
	AssignmentID string `json:"assignmentid"`
}

type CreateAssignmentRequest struct {
	CourseID    string `json:"courseid,omitempty"`
	Name        string `json:"name"`
	Optional    bool   `json:"optional"`
	MaxScore    int    `json:"maxScore"`
	ReleaseDate string `json:"releaseDate"`
	DueDate     string `json:"dueDate"`
}

type DeleteAssignmentRequest struct {
	CourseID     string
	AssignmentID string
}

type UpdateAssignmentRequest struct {
	CourseID     string `json:"courseid,omitempty"`
	AssignmentID string `json:"assignmentid,omitempty"`
	Name         string `json:"name,omitempty"`
	Optional     bool   `json:"optional,omitempty"`
	MaxScore     int    `json:"maxScore,omitempty"`
	ReleaseDate  string `json:"releaseDate,omitempty"`
	DueDate      string `json:"dueDate,omitempty"`
}
