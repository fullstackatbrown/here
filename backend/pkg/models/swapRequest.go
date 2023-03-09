package models

import "time"

type RequestStatus string

const (
	STATUS_PENDING   RequestStatus = "pending"
	STATUS_CANCELLED RequestStatus = "cancelled"
	STATUS_APPROVED  RequestStatus = "approved"
	STATUS_DENIED    RequestStatus = "denied"
	STATUS_ARCHIVED  RequestStatus = "archived"
)

type SwapRequest struct {
	ID           string        `firestore:"id,omitempty"`
	StudentID    string        `firestore:"studentID"`
	OldSectionID string        `firestore:"oldSectionID"`
	NewSectionID string        `firestore:"newSectionID"`
	IsTemporary  bool          `firestore:"isTemporary"`
	RequestTime  time.Time     `firestore:"requestTime"`
	Reason       string        `firestore:"reason"`
	Status       RequestStatus `firestore:"status"`
	HandledBy    string        `firestore:"handledBy"`
}
