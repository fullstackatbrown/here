package models

const (
	FirestoreSectionsCollection = "sections"
)

type Day string

const (
	Sunday    Day = "Sunday"
	Monday    Day = "Monday"
	Tuesday   Day = "Tuesday"
	Wednesday Day = "Wednesday"
	Thursday  Day = "Thursday"
	Friday    Day = "Friday"
	Saturday  Day = "Saturday"
)

type Section struct {
	ID                 string              `firestore:"id,omitempty"`
	CourseID           string              `firestore:"courseID"`
	Day                Day                 `firestore:"day"`
	StartTime          string              `firestore:"startTime"`
	EndTime            string              `firestore:"endTime"`
	Location           string              `firestore:"location"`
	Capacity           int                 `firestore:"capacity"`
	NumEnrolled        int                 `firestore:"numEnrolled"`
	SwappedInStudents  map[string][]string `firestore:"swappedInStudents"`
	SwappedOutStudents map[string][]string `firestore:"swappedOutStudents"`
}

type GetSectionRequest struct {
	SectionID string `json:"sectionid"`
}

type CreateSectionRequest struct {
	Course *Course `json:"course,omitempty"`
	Day    Day     `json:"day"`
	// must be ISO8601 compliant, UTC Time
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Location  string `json:"location,omitempty"`
	Capacity  int    `json:"capacity"`
}

type UpdateSectionRequest struct {
	Course    *Course `json:"course,omitempty"`
	SectionID *string `json:"sectionid,omitempty"`
	Day       *Day    `json:"day,omitempty"`
	// must be ISO8601 compliant, UTC Time
	StartTime     *string `json:"startTime,omitempty"`
	EndTime       *string `json:"endTime,omitempty"`
	Location      *string `json:"location,omitempty"`
	Capacity      *int    `json:"capacity,omitempty"`
	NotifyStudent bool    `json:"notifyStudent,omitempty"`
}

type DeleteSectionRequest struct {
	Course    *Course
	SectionID string
}
