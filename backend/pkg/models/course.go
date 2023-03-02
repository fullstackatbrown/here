package models

var (
	FirestoreCoursesCollection = "courses"
)

type Course struct {
	ID           string
	Title        string
	Code         string
	Term         string
	Sections     []Section
	Assignments  []Assignment
	GradeOptions []string
	Students     map[string]string
	SurveyID     string
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

type EditCourseRequest struct {
	CourseID string `json:"courseid"`
	Title    string `json:"title"`
	Code     string `json:"code"`
	Term     string `json:"name"`
}
