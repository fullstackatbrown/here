package models

import "time"

var (
	FirestoreSectionsCollection = "sections"
)

type Section struct {
	ID         string
	Day        string
	StartTime  time.Time
	EndTime    time.Time
	Location   string
	Capacity   int
	Enrollment int
	Students   []string // list of student ids
}

type GetSectionRequest struct {
	SectionID string
}

type CreateSectionRequest struct {
	Day       string
	StartTime string
	EndTime   string
	Location  string
	Capacity  int
}

type DeleteSectionRequest struct {
	SectionID string
}
