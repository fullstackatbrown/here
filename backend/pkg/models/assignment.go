package models

import "time"

type Assignment struct {
	Name      string
	Mandatory bool
	startDate time.Time
	endDate   time.Time
}
