package models

var (
	FirestoreSurveysCollection         = "surveys"
	FirestoreSurveyResponsesCollection = "responses"
)

type Survey struct {
	ID        string
	CourseID  string
	Name      string
	Times     []string
	Capacity  []int
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
	CourseID string
	Name     string
}

type CreateSurveyResponseRequest struct {
	UserID   string   `json:"omitempty"`
	SurveyID string   `json:"omitempty"`
	Times    []string `json:"times"`
}

func InitSurvey(name string, courseID string, sections []Section) *Survey {
	// Get all the unique times
	sectionTimes := make(map[string]int)
	for _, s := range sections {
		sectionTimes[s.TimeAsString()] = 0
	}
	for _, s := range sections {
		sectionTimes[s.TimeAsString()] += s.Capacity
	}

	times := make([]string, 0)
	capacity := make([]int, 0)

	for k, v := range sectionTimes {
		times = append(times, k)
		capacity = append(capacity, v)
	}

	return &Survey{
		Name:     name,
		CourseID: courseID,
		Times:    times,
		Capacity: capacity,
	}
}
