package models

import "time"

type SwapRequest struct {
	ID           string
	StudentID    string
	OldSectionID string
	NewSectionID string
	IsTemporary  bool
	RequestTime  time.Time
	Reason       string
	Approved     bool
	HandledBy    string
}
