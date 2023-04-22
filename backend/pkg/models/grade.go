package models

import "fmt"

type Grade struct {
	StudentID   string `firestore:"studentID"`
	Grade       int    `firestore:"grade"`
	GradedBy    string `firestore:"gradedBy"`
	TimeUpdated string `firestore:"timeUpdated"`
}

type CreateGradeRequest struct {
	CourseID     string `json:"courseid,omitempty"`
	AssignmentID string `json:"assignmentid,omitempty"`
	StudentID    string `json:"studentid"`
	Grade        int    `json:"grade"`
	GradedBy     *User  `json:"gradedBy,omitempty"`
}

type DeleteGradeRequest struct {
	CourseID     string
	AssignmentID string
	GradeID      string // equivalent to StudentID
}

func CreateGradeID(req *CreateGradeRequest) string {
	return fmt.Sprintf("%s,%s,%s", req.CourseID, req.AssignmentID, req.StudentID)
}
