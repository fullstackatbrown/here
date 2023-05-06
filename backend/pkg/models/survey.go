package models

const (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID              string                    `firestore:"id,omitempty"`
	CourseID        string                    `firestore:"courseID"`
	Name            string                    `firestore:"name"`
	Description     string                    `firestore:"description"`
	Published       bool                      `firestore:"published"`
	EndTime         string                    `firestore:"endTime"`
	Capacity        map[string]map[string]int `firestore:"capacity"`
	Responses       map[string][]string       `firestore:"responses"`
	Results         map[string][]string       `firestore:"results"`
	ResultsReadable map[string][]string       `firestore:"resultsReadable"`
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
	CourseID       *string `json:"courseid,omitempty"`
	SurveyID       *string `json:"surveyid,omitempty"`
	Name           *string `json:"name,omitempty"`
	Description    *string `json:"description,omitempty"`
	EndTime        *string `json:"endTime,omitempty"`
	UpdateCapacity bool    `json:"updateCapacity,omitempty"`
}

type CreateSurveyResponseRequest struct {
	User         *User    `json:"user,omitempty"`
	CourseID     string   `json:"courseid,omitempty"`
	Survey       *Survey  `json:"survey,omitempty"`
	Availability []string `json:"availability"`
}

type SurveyResponse struct {
	Name         string   `json:"name"`
	Email        string   `json:"email"`
	Availability []string `json:"availability"`
}
