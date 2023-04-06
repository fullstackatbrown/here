package models

import (
	"fmt"
	"strings"

	"github.com/fullstackatbrown/here/pkg/utils"
)

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
	EnrolledStudents   []string            `firestore:"enrolledStudents"`
	SwappedInStudents  map[string][]string `firestore:"swappedInStudents"`
	SwappedOutStudents map[string][]string `firestore:"swappedOutStudents"`
}

type GetSectionRequest struct {
	SectionID string `json:"sectionid"`
}

type CreateSectionRequest struct {
	CourseID string `json:"courseid,omitempty"`
	Day      Day    `json:"day"`
	// must be ISO8601 compliant, UTC Time
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Location  string `json:"location,omitempty"`
	Capacity  int    `json:"capacity"`
}

type UpdateSectionRequest struct {
	CourseID  *string `json:"courseid,omitempty"`
	SectionID *string `json:"sectionid,omitempty"`
	Day       *Day    `json:"day,omitempty"`
	// must be ISO8601 compliant, UTC Time
	StartTime *string `json:"startTime,omitempty"`
	EndTime   *string `json:"endTime,omitempty"`
	Location  *string `json:"location,omitempty"`
	Capacity  *int    `json:"capacity,omitempty"`
}

type DeleteSectionRequest struct {
	CourseID  string
	SectionID string
}

func CreateSectionID(req *CreateSectionRequest) (string, error) {
	startTime, err := utils.ParseIsoTimeToReadableUTC(req.StartTime)
	if err != nil {
		return "", fmt.Errorf("Error parsing time: %s", req.StartTime)
	}
	endTime, err := utils.ParseIsoTimeToReadableUTC(req.EndTime)
	if err != nil {
		return "", fmt.Errorf("Error parsing time: %s", req.EndTime)
	}
	location := strings.ToLower(strings.ReplaceAll(req.Location, " ", ""))
	return fmt.Sprintf("%s,%s,%s,%s", req.Day, startTime, endTime, location), nil
}

func (section *Section) TimeAsString() (string, error) {
	return fmt.Sprintf("%s,%s,%s", section.Day, section.StartTime, section.EndTime), nil
}

// Returns a map from a unique time, to a map from section id (that has the time) to capacity
func GetUniqueSectionTimes(sections []*Section) (map[string]map[string]int, error) {
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
