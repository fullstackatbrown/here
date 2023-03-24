package models

var (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID          string                    `firestore:"id,omitempty"`
	CourseID    string                    `firestore:"courseID"`
	Name        string                    `firestore:"name"`
	Description string                    `firestore:"description"`
	EndTime     string                    `firestore:"endTime"`
	Capacity    map[string]map[string]int `firestore:"capacity"`
	Responses   map[string][]string       `firestore:"responses"`
	Exceptions  []string                  `firestore:"exceptions"`
	Published   bool                      `firestore:"published"`
}

type Times struct {
	Name     string
	Capacity int
}

type CreateSurveyRequest struct {
	CourseID    string `json:"courseid,omitempty"`
	Name        string `json:"name"`
	Description string `json:"description"`
	EndTime     string `json:"endTime"`
}

type UpdateSurveyRequest struct {
	CourseID    *string `json:"courseid,omitempty"`
	SurveyID    *string `json:"surveyid,omitempty"`
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
	EndTime     *string `json:"endTime,omitempty"`
}

type CreateSurveyResponseRequest struct {
	CourseID     string   `json:"courseID"`
	UserID       string   `json:"userID"`
	SurveyID     string   `json:"surveyid,omitempty"`
	Availability []string `json:"availability"`
}

type GenerateResultsResponseItem struct {
	Section  Section  `json:"section"`
	Students []string `json:"students"`
}
