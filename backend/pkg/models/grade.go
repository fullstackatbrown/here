package models

import "fmt"

const (
	FirestoreGradesCollection = "grades"
)

type Grade struct {
	ID          string `firestore:"id,omitempty"`
	StudentID   string `firestore:"studentID"`
	Grade       int    `firestore:"grade"`
	GradedBy    string `firestore:"gradedBy"`
	TimeUpdated string `firestore:"timeUpdated"`
}

type CreateGradeRequest struct {
	CourseID     string `json:"courseid,omitempty"`
	AssignmentID string `json:"assignmentid,omitempty"`
	GradeID      string `json:"gradeid,omitempty"`
	StudentID    string `json:"studentid"`
	Grade        int    `json:"grade"`
	GradedBy     string `json:"gradedBy,omitempty"`
}

type DeleteGradeRequest struct {
	CourseID     string
	AssignmentID string
	GradeID      string
}

func CreateGradeID(req *CreateGradeRequest) string {
	return fmt.Sprintf("%s,%s,%s", req.CourseID, req.AssignmentID, req.StudentID)
}
