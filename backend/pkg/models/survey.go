package models

var (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID           string              `firestore:"id,omitempty"`
	CourseID     string              `firestore:"courseID"`
	Name         string              `firestore:"name"`
	Description  string              `firestore:"description"`
	SectionTimes map[string][]string `firestore:"sectionTimes"`
	Capacity     map[string]int      `firestore:"capacity"`
	Responses    map[string][]string `firestore:"responses"`
	Results      map[string][]string `firestore:"results"`
	Exceptions   []string            `firestore:"exceptions"`
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
	// Get all the unique times
	capacity := make(map[string]int)
	sectionTimes := make(map[string][]string)
	for _, s := range sections {
		capacity[s.TimeAsString()] = 0
		sectionTimes[s.TimeAsString()] = make([]string, 0)
	}
	for _, s := range sections {
		capacity[s.TimeAsString()] += s.Capacity
		sectionTimes[s.TimeAsString()] = append(sectionTimes[s.TimeAsString()], s.ID)
	}

	return &Survey{
		Name:         req.Name,
		Description:  req.Description,
		CourseID:     req.CourseID,
		SectionTimes: sectionTimes,
		Capacity:     capacity,
		Responses:    make(map[string][]string),
		Results:      make(map[string][]string),
		Exceptions:   make([]string, 0),
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
