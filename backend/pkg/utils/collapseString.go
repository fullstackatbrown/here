package utils

import (
	"regexp"
)

// CollapseString removes all whitespace from a string and replaces it with a
// single space.
func CollapseString(s string) string {
	return regexp.MustCompile(`[^a-zA-Z0-9]+`).ReplaceAllString(s, "")
}
