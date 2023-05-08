package qerrors

import (
	"errors"
	"fmt"

	"github.com/fullstackatbrown/here/pkg/models"
)

var (
	// Generic errors
	InvalidBody = errors.New("invalid body")

	// Course errors
	CourseNotFoundError            = errors.New("course not found")
	CourseNotFoundOrNonactiveError = errors.New("course not found or non-active")
	SectionNotFoundError           = errors.New("section not found")
	AssignmentNotFoundError        = errors.New("assignment not found")
	SurveyNotFoundError            = errors.New("survey not found")
	CourseAlreadyExistsError       = errors.New("course already exists")
	InvalidEntryCodeError          = errors.New("invalid entry code")

	// Permission errors
	EnrolledAsStudentError = errors.New("user is enrolled as a student")

	// Section errors
	SectionAlreadyExistsError = errors.New("a section already exists at the same time and location")

	// User errors
	DeleteUserError          = errors.New("an error occurred while deleting user")
	UserNotFoundError        = errors.New("user not found")
	UserProfileNotFoundError = errors.New("user profile not found")
	InvalidEmailError        = errors.New("invalid Brown email address")
	InvalidDisplayName       = errors.New("invalid display name provided")

	// Assignment errors
	AssignmentAlreadyExistsError = errors.New("an assignment with the same name already exists")

	// Swap errors
	SwapNotFoundError = errors.New("swap not found")
)

func PermissionExistsError(perm models.CoursePermission) error {
	return fmt.Errorf("user already has %s access", perm)
}
