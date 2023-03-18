package utils

import "time"

func ParseIsoTimeToReadableUTC(t string) (string, error) {
	utcTime, err := time.Parse(time.RFC3339, t)
	if err != nil {
		return "", err
	}

	ny, err := time.LoadLocation("America/New_York")
	if err != nil {
		return "", err
	}

	nyTime := utcTime.In(ny)

	return nyTime.Format(time.Kitchen), nil
}
