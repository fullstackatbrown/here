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
	SectionID string `json:"sectionid"`
}

type CreateSectionRequest struct {
	// (Sunday = 0, ...)
	Day int `json:"day"`
	// must be ISO8601 compliant
	StartTime string `json:"starttime"`
	EndTime   string `json:"endtime"`
	Location  string `json:"location"`
	Capacity  int    `json:"capacity"`
}

type DeleteSectionRequest struct {
	SectionID string `json:"sectionid"`
}

func (section *Section) TimeAsString() string {
	return fmt.Sprintf("%d", int(section.Day)) + "|" + section.StartTime + "|" + section.EndTime
}
