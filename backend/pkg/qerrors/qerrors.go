package qerrors

import "errors"

var (
	// Generic errors
	InvalidBody = errors.New("invalid body")

	// Course errors
	CourseNotFoundError     = errors.New("course not found")
	SectionNotFoundError    = errors.New("section not found")
	AssignmentNotFoundError = errors.New("assignment not found")

	// User errors
	DeleteUserError    = errors.New("an error occurred while deleting user")
	UserNotFoundError  = errors.New("user not found")
	InvalidEmailError  = errors.New("invalid Brown email address")
	InvalidDisplayName = errors.New("invalid display name provided")

	// Queue errors
	InvalidQueueError  = errors.New("the provided queue is not valid")
	InvalidTicketError = errors.New("the provided ticket is not valid")
	QueueCooldownError = errors.New("user already made a ticket within the last 15 minutes")
	ActiveTicketError  = errors.New("User already has an active ticket in queue")
)
