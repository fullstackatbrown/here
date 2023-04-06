package qerrors

import "errors"

var (
	// Generic errors
	InvalidBody = errors.New("invalid body")

	// Course errors
	CourseNotFoundError      = errors.New("course not found")
	SectionNotFoundError     = errors.New("section not found")
	AssignmentNotFoundError  = errors.New("assignment not found")
	SurveyNotFoundError      = errors.New("survey not found")
	CourseAlreadyExistsError = errors.New("course already exists")
	InvalidEntryCodeError    = errors.New("invalid entry code")

	// Section errors
	SectionAlreadyExistsError = errors.New("a section already exists at the same time and location")

	// User errors
	DeleteUserError    = errors.New("an error occurred while deleting user")
	UserNotFoundError  = errors.New("user not found")
	InvalidEmailError  = errors.New("invalid Brown email address")
	InvalidDisplayName = errors.New("invalid display name provided")

	// Assignment errors
	AssignmentAlreadyExistsError = errors.New("an assignment with the same name already exists")
)
