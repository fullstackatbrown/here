package models

import "time"

type RequestStatus string

const (
	STATUS_PENDING           RequestStatus = "pending"
	STATUS_CANCELLED         RequestStatus = "cancelled"
	STATUS_APPROVED          RequestStatus = "approved"
	STATUS_DENIED            RequestStatus = "denied"
	STATUS_ARCHIVED          RequestStatus = "archived"
	FirestoreSwapsCollection               = "swaps"
)

type Swap struct {
	ID           string        `firestore:"id,omitempty"`
	StudentID    string        `firestore:"studentID"`
	OldSectionID string        `firestore:"oldSectionID"`
	NewSectionID string        `firestore:"newSectionID"`
	AssignmentID string        `firestore:"assignmentID"`
	RequestTime  time.Time     `firestore:"requestTime"`
	Reason       string        `firestore:"reason"`
	Status       RequestStatus `firestore:"status"`
	HandledBy    string        `firestore:"handledBy"`
}

type CreateSwapRequest struct {
	CourseID     string `json:"courseID,omitempty"`
	User         *User  `json:"user,omitempty"`
	OldSectionID string `json:"oldSectionID"`
	NewSectionID string `json:"newSectionID"`
	AssignmentID string `json:"assignmentID"`
	Reason       string `json:"reason"`
}

type UpdateSwapRequest struct {
	CourseID     *string `json:"courseID,omitempty"`
	SwapID       *string `json:"swapID,omitempty"`
	NewSectionID *string `json:"newSectionID,omitempty"`
	AssignmentID *string `json:"assignmentID,omitempty"`
	Reason       *string `json:"reason,omitempty"`
}

type HandleSwapRequest struct {
	CourseID  string        `json:"courseID,omitempty"`
	SwapID    string        `json:"swapID,omitempty"`
	Status    RequestStatus `json:"status,omitempty"`
	HandledBy *User         `json:"handledBy,omitempty"`
}
