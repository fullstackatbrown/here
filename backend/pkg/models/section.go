package models

import (
	"strings"
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
	Day      string `json:"day"`
	// must be ISO8601 compliant
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Location  string `json:"location"`
	Capacity  int    `json:"capacity"`
}

type DeleteSectionRequest struct {
	CourseID  string
	SectionID string
}

func (section *Section) TimeAsString() string {
	return strings.Join([]string{string(section.Day), section.StartTime, section.EndTime}, ",")
}
