package models

type Survey struct {
	ID        string
	Name      string
	Times     []string
	Capacity  []int
	Responses []Response
}

type Response struct {
	ID        string
	Responses []int
}

type Times struct {
	Name     string
	Capacity int
}

type CreateSurveyRequest struct {
	CourseID string
	Name     string
}
