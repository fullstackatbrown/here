package models

import "time"

type Assignment struct {
	ID              string
	Name            string
	Mandatory       bool
	StartDate       time.Time
	EndDate         time.Time
	GradesByStudent map[string]string
	Grades          []Grade
}
