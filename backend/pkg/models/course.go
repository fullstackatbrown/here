package models

var (
	FirestoreCoursesCollection = "courses"
	FirestoreInvitesCollection = "invites"
)

type Course struct {
	ID           string
	Title        string
	Code         string
	Term         string
	Sections     []Section
	Assignments  []Assignment
	GradeOptions []string
	Students     []string
}

type GetCourseRequest struct {
	CourseID string
}

type CreateCourseRequest struct {
	Title     string
	Code      string
	Term      string
	CreatedBy *User
}

type DeleteCourseRequest struct {
	CourseID string
}

type EditCourseRequest struct {
	CourseID string
	Title    string
	Code     string
	Term     string
}
