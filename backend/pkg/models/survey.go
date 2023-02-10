package models

var (
	FirestoreSurveysCollection         = "surveys"
	FirestoreSurveyResponsesCollection = "responses"
)

type Survey struct {
	ID        string
	CourseID  string
	Name      string
	Capacity  map[string]int
	Responses []SurveyResponse
}

type SurveyResponse struct {
	ID     string
	UserID string
	Times  []string
}

type Times struct {
	Name     string
	Capacity int
}

type CreateSurveyRequest struct {
	CourseID string `json:"courseid"`
	Name     string `json:"name"`
}

type CreateSurveyResponseRequest struct {
	UserID   string   `json:"omitempty"`
	SurveyID string   `json:"omitempty"`
	Times    []string `json:"times"`
}

func InitSurvey(name string, courseID string, sections []Section) *Survey {
	// Get all the unique times
	capacity := make(map[string]int)
	for _, s := range sections {
		capacity[s.TimeAsString()] = 0
	}
	for _, s := range sections {
		capacity[s.TimeAsString()] += s.Capacity
	}

	return &Survey{
		Name:     name,
		CourseID: courseID,
		Capacity: capacity,
	}
}
