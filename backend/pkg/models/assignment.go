package models

var (
	FirestoreAssignmentsCollection = "assignments"
)

type Assignment struct {
	ID              string            `firestore:"id,omitempty"`
	CourseID        string            `firestore:"courseID"`
	Name            string            `firestore:"name"`
	Optional        bool              `firestore:"optional"`
	MaxScore        int               `firestore:"maxScore"`
	ReleaseDate     string            `firestore:"releaseDate"`
	DueDate         string            `firestore:"dueDate"`
	GradesByStudent map[string]string `firestore:"gradesByStudent"`
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
