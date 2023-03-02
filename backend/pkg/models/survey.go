package models

var (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID           string              `firestore:"id,omitempty"`
	CourseID     string              `firestore:"courseID"`
	Name         string              `firestore:"name"`
	Description  string              `firestore:"description"`
	Capacity     map[string]int      `firestore:"capacity"`
	Responses    map[string][]string `firestore:"responses"`
	NumResponses int                 `firestore:"numResponses"`
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
	UserID       string   `json:"userid,omitempty"`
	SurveyID     string   `json:"surveyid,omitempty"`
	Availability []string `json:"availability"`
}

func InitSurvey(req *CreateSurveyRequest, sections []*Section) *Survey {
	// Get all the unique times
	capacity := make(map[string]int)
	for _, s := range sections {
		capacity[s.TimeAsString()] = 0
	}
	for _, s := range sections {
		capacity[s.TimeAsString()] += s.Capacity
	}

	return &Survey{
		Name:         req.Name,
		Description:  req.Description,
		CourseID:     req.CourseID,
		Capacity:     capacity,
		NumResponses: 0,
		Responses:    make(map[string][]string),
	}
}

func (s *Survey) Update(req *UpdateSurveyRequest, sections []*Section) {
	// Get all the unique times
	capacity := make(map[string]int)
	for _, s := range sections {
		capacity[s.TimeAsString()] = 0
	}
	for _, s := range sections {
		capacity[s.TimeAsString()] += s.Capacity
	}

	s.Capacity = capacity

	if req.Description != "" {
		s.Description = req.Description
	}

	if req.Name != "" {
		s.Description = req.Name
	}
}
