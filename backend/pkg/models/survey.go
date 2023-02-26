package models

var (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID           string              `firestore:"id,omitempty"`
	CourseID     string              `firestore:"courseID"`
	Name         string              `firestore:"name"`
	Capacity     map[string]int      `firestore:"capacity"`
	Responses    map[string][]string `firestore:"responses"`
	NumResponses int                 `firestore:"numResponses"`
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
	UserID       string   `json:"omitempty"`
	SurveyID     string   `json:"omitempty"`
	Availability []string `json:"availability"`
}

func InitSurvey(name string, courseID string, sections []*Section) *Survey {
	// Get all the unique times
	capacity := make(map[string]int)
	for _, s := range sections {
		capacity[s.TimeAsString()] = 0
	}
	for _, s := range sections {
		capacity[s.TimeAsString()] += s.Capacity
	}

	return &Survey{
		Name:         name,
		CourseID:     courseID,
		Capacity:     capacity,
		NumResponses: 0,
		Responses:    make(map[string][]string),
	}
}
