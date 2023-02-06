package models

import "time"

type Section struct {
	ID         string
	Day        time.Weekday
	StartTime  time.Time
	EndTime    time.Time
	Location   string
	Capacity   int
	Enrollment int
	Students   []string // list of student ids
}
