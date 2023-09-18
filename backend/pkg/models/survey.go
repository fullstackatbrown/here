package models

const (
	FirestoreSurveysCollection = "surveys"
)

type Survey struct {
	ID              string                      `firestore:"id,omitempty"`
	CourseID        string                      `firestore:"courseID"`
	Name            string                      `firestore:"name"`
	Description     string                      `firestore:"description"`
	Published       bool                        `firestore:"published"`
	EndTime         string                      `firestore:"endTime"`
	Options         []*SurveyOption             `firestore:"options"`
	Responses       map[string][]string         `firestore:"responses"`
	Results         map[string][]CourseUserData `firestore:"results"`
	// Map from the option to a map from sectionID to capacity
	SectionCapacity map[string]map[string]int   `firestore:"sectionCapacity,omitempty"`
}

type SurveyOption struct {
	Option   string `firestore:"option"`
	Capacity int    `firestore:"capacity"`
}

type CreateSurveyRequest struct {
	Course          *Course                   `json:"course,omitempty"`
	Name            string                    `json:"name"`
	Description     string                    `json:"description"`
	EndTime         string                    `json:"endTime"`
	Options         []*SurveyOption           `json:"options"`
	SectionCapacity map[string]map[string]int `json:"sectionCapacity,omitempty"`
}

type UpdateSurveyRequest struct {
	Course          *Course                   `json:"course,omitempty"`
	SurveyID        *string                   `json:"surveyid,omitempty"`
	Name            *string                   `json:"name,omitempty"`
	Description     *string                   `json:"description,omitempty"`
	EndTime         *string                   `json:"endTime,omitempty"`
	Options         *[]SurveyOption           `json:"options"`
	SectionCapacity map[string]map[string]int `json:"sectionCapacity,omitempty"`
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
