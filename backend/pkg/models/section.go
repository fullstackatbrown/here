package models

import (
	"fmt"
	"time"
)

var (
	FirestoreSectionsCollection = "sections"
)

type Section struct {
	ID                  string              `firestore:"id,omitempty"`
	CourseID            string              `firestore:"courseID"`
	Day                 time.Weekday        `firestore:"day"`
	StartTime           string              `firestore:"startTime"`
	EndTime             string              `firestore:"endTime"`
	Location            string              `firestore:"location"`
	Capacity            int                 `firestore:"capacity"`
	NumStudentsEnrolled int                 `firestore:"numStudentsEnrolled"`
	EntrolledStudents   []string            `firestore:"enrolledStudents"`
	SwappedInStudents   map[string][]string `firestore:"swappedInStudents"`
	SwappedOutStudents  map[string][]string `firestore:"swappedOutStudents"`
}

type GetSectionRequest struct {
	SectionID string `json:"sectionid"`
}

type CreateSectionRequest struct {
	CourseID string `json:"courseid,omitempty"`
	// (Sunday = 0, ...)
	Day int `json:"day"`
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
	return fmt.Sprintf("%d", int(section.Day)) + " " + section.StartTime + "-" + section.EndTime
}
