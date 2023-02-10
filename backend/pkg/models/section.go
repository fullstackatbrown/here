package models

import (
	"fmt"
	"time"
)

var (
	FirestoreSectionsCollection = "sections"
)

type Section struct {
	ID         string
	Day        time.Weekday
	StartTime  string
	EndTime    string
	Location   string
	Capacity   int
	Enrollment int
	Students   []string // list of student ids
}

type GetSectionRequest struct {
	SectionID string
}

type CreateSectionRequest struct {
	Day int
	// must be ISO8601 compliant
	StartTime string
	EndTime   string
	Location  string
	Capacity  int
}

type DeleteSectionRequest struct {
	SectionID string
}

func (section *Section) TimeAsString() string {
	return fmt.Sprintf("%d", int(section.Day)) + "|" + section.StartTime + "|" + section.EndTime
}
