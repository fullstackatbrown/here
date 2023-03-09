package models

var (
	FirestoreAssignmentsCollection = "assignments"
)

type Assignment struct {
	ID              string            `firestore:"id,omitempty"`
	CourseID        string            `firestore:"courseID"`
	Name            string            `firestore:"name"`
	Mandatory       bool              `firestore:"mandatory"`
	StartDate       string            `firestore:"startDate"`
	EndDate         string            `firestore:"endDate"`
	GradesByStudent map[string]string `firestore:"gradesByStudent"`
}

type GetAssignmentRequest struct {
	AssignmentID string `json:"assignmentid"`
}

type CreateAssignmentRequest struct {
	CourseID  string `json:"courseid,omitempty"`
	Name      string `json:"name"`
	Mandatory bool   `json:"mandatory"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}

type DeleteAssignmentRequest struct {
	CourseID     string
	AssignmentID string
}
