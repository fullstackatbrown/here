package models

import "time"

type Grade struct {
	ID          string    `firestore:"id,omitempty"`
	StudentID   string    `firestore:"studentID"`
	Grade       string    `firestore:"grade"`
	GradedBy    string    `firestore:"gradedBy"`
	TimeUpdated time.Time `firestore:"timeUpdated"`
}
