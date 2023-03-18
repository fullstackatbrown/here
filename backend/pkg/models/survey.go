package models

import "time"

var (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID          string                    `firestore:"id,omitempty"`
	CourseID    string                    `firestore:"courseID"`
	Name        string                    `firestore:"name"`
	Description string                    `firestore:"description"`
	EndTime     time.Time                 `firestore:"endTime"`
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

func InitSurvey(req *CreateSurveyRequest, sections []*Section) (*Survey, error) {
	capacity, err := getUniqueSectionTimes(sections)
	if err != nil {
		return nil, err
	}

	return &Survey{
		Name:        req.Name,
		Description: req.Description,
		CourseID:    req.CourseID,
		Capacity:    capacity,
		Responses:   make(map[string][]string),
		Exceptions:  make([]string, 0),
	}, nil
}

func (s *Survey) Update(req *UpdateSurveyRequest, sections []*Section) error {
	capacity, err := getUniqueSectionTimes(sections)
	if err != nil {
		return err
	}

	s.Capacity = capacity

	if req.Description != "" {
		s.Description = req.Description
	}

	if req.Name != "" {
		s.Description = req.Name
	}

	return nil
}

// Returns a map from a unique time, to a map from section id (that has the time) to capacity
func getUniqueSectionTimes(sections []*Section) (map[string]map[string]int, error) {
	capacity := make(map[string]map[string]int)
	for _, s := range sections {
		t, err := s.TimeAsString()
		if err != nil {
			return nil, err
		}

		_, ok := capacity[t]
		if !ok {
			capacity[t] = make(map[string]int)
		}
		_, ok = capacity[t][s.ID]
		if !ok {
			capacity[t][s.ID] = 0
		}
		capacity[t][s.ID] += s.Capacity
	}

	return capacity, nil
}
