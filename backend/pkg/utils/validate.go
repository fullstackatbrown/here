package utils

import (
	"fmt"
	"strings"

	"github.com/fullstackatbrown/here/pkg/models"
)

func ValidateCreateUserRequest(u *models.CreateUserRequest) error {
	if err := validateEmail(u.Email); err != nil {
		return err
	}

	if err := validatePassword(u.Password); err != nil {
		return err
	}

	if err := validateDisplayName(u.DisplayName); err != nil {
		return err
	}

	return nil
}

func ValidateID(id string) error {
	if id == "" {
		return fmt.Errorf("id must be a non-empty string")
	}
	if len(id) > 128 {
		return fmt.Errorf("id string must not be longer than 128 characters")
	}
	return nil
}

func validateEmail(email string) error {
	if email == "" {
		return fmt.Errorf("email must be a non-empty string")
	}
	if parts := strings.Split(email, "@"); len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return fmt.Errorf("malformed email string: %q", email)
	}
	return nil
}

func validatePassword(val string) error {
	if len(val) < 6 {
		return fmt.Errorf("password must be a string at least 6 characters long")
	}
	return nil
}

func validateDisplayName(val string) error {
	if val == "" {
		return fmt.Errorf("display name must be a non-empty string")
	}
	return nil
}

func validateID(id string) error {
	if id == "" {
		return fmt.Errorf("id must be a non-empty string")
	}
	if len(id) > 128 {
		return fmt.Errorf("id string must not be longer than 128 characters")
	}
	return nil
}
