package utils

import (
	"math/rand"
	"time"
)

// generates a random, 6-character access code consisting of capitalized letters and numbers
func GenerateCourseEntryCode() string {
	rand.Seed(time.Now().UnixNano())

	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const codeLength = 6

	code := make([]byte, codeLength)
	for i := range code {
		code[i] = charset[rand.Intn(len(charset))]
	}
	return string(code)
}
