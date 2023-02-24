package models

import "time"

type Grade struct {
	ID          string
	StudentID   string
	Grade       string
	GradedBy    string
	TimeUpdated time.Time
}
