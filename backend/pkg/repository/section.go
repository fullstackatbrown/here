package repository

import (
	"fmt"
	"strings"
	"time"

	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
)

func (fr *FirebaseRepository) CreateSection(courseID string, c *models.CreateSectionRequest) (section *models.Section, err error) {
	startTime, err := time.Parse(time.Kitchen, c.StartTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing start time: %v\n", err)
	}
	endTime, err := time.Parse(time.Kitchen, c.EndTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing end time: %v\n", err)
	}

	// TODO: check if c.Day is a valid weekday constant

	section = &models.Section{
		Day:        strings.ToLower(c.Day),
		StartTime:  startTime,
		EndTime:    endTime,
		Location:   c.Location,
		Capacity:   c.Capacity,
		Enrollment: 0,
	}

	_, err = fr.GetCourseByID(courseID)
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}

	// TODO: standardize time formating

	courseDoc := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID)
	ref, _, err := courseDoc.Collection(models.FirestoreSectionsCollection).Add(firebase.Context, map[string]interface{}{
		"day":       section.Day,
		"starttime": section.StartTime.Format(time.Kitchen),
		"endtime":   section.EndTime.Format(time.Kitchen),
	})
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}
	section.ID = ref.ID

	return section, nil
}
