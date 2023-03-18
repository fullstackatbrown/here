package models

import (
	"fmt"

	"github.com/fullstackatbrown/here/pkg/utils"
)

var (
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

func (section *Section) TimeAsString() (string, error) {
	startTime, err := utils.ParseIsoTimeToReadableUTC(section.StartTime)
	if err != nil {
		return "", err
	}
	endTime, err := utils.ParseIsoTimeToReadableUTC(section.EndTime)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s %s - %s", section.Day, startTime, endTime), nil
}
