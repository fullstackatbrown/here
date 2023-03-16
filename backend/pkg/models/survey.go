package models

var (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID          string                    `firestore:"id,omitempty"`
	CourseID    string                    `firestore:"courseID"`
	Name        string                    `firestore:"name"`
	Description string                    `firestore:"description"`
	Capacity    map[string]map[string]int `firestore:"capacity"`
	Responses   map[string][]string       `firestore:"responses"`
	Exceptions  []string                  `firestore:"exceptions"`
}

type Times struct {
	Name     string
	Capacity int
}

type CreateSurveyRequest struct {
	CourseID    string `json:"courseid,omitempty"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type UpdateSurveyRequest struct {
	CourseID    string `json:"courseid,omitempty"`
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
}

type CreateSurveyResponseRequest struct {
	UserID       string   `json:"userID"`
	SurveyID     string   `json:"surveyid,omitempty"`
	Availability []string `json:"availability"`
}

type GenerateResultsResponseItem struct {
	Section  Section  `json:"section"`
	Students []string `json:"students"`
}

func InitSurvey(req *CreateSurveyRequest, sections []*Section) *Survey {
	// Capacity is a map from the unique times, to a map from section id to capacity
	capacity := make(map[string]map[string]int)
	for _, s := range sections {
		capacity[s.TimeAsString()] = make(map[string]int)
		capacity[s.TimeAsString()][s.ID] = 0
	}
	for _, s := range sections {
		capacity[s.TimeAsString()][s.ID] += s.Capacity
	}

	return &Survey{
		Name:        req.Name,
		Description: req.Description,
		CourseID:    req.CourseID,
		Capacity:    capacity,
		Responses:   make(map[string][]string),
		Exceptions:  make([]string, 0),
	}
}

func (s *Survey) Update(req *UpdateSurveyRequest, sections []*Section) {
	// Get all the unique times
	capacity := make(map[string]map[string]int)
	for _, s := range sections {
		capacity[s.TimeAsString()] = make(map[string]int)
		capacity[s.TimeAsString()][s.ID] = 0
	}
	for _, s := range sections {
		capacity[s.TimeAsString()][s.ID] += s.Capacity
	}

	s.Capacity = capacity

	if req.Description != "" {
		s.Description = req.Description
	}

	if req.Name != "" {
		s.Description = req.Name
	}
}
