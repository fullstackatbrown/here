package repository

import (
	"fmt"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/mitchellh/mapstructure"
	"github.com/relvacode/iso8601"
)

func (fr *FirebaseRepository) initializeSectionsListener() {
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newSections := make(map[string]*models.Section)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Section
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newSections[doc.Ref.ID] = &c
		}

		fr.sectionsLock.Lock()
		defer fr.sectionsLock.Unlock()
		fr.sections = newSections

		return nil
	}

	done := make(chan bool)
	query := fr.firestoreClient.Collection(models.FirestoreSectionsCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating course collection listner: %v\n", err)
		}
	}()
	<-done
}

func (fr *FirebaseRepository) CreateSection(courseID string, c *models.CreateSectionRequest) (section *models.Section, err error) {
	startTime, err := iso8601.ParseString(c.StartTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing start time: %v\n", err)
	}
	endTime, err := iso8601.ParseString(c.EndTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing end time: %v\n", err)
	}

	// TODO: check if c.Day is a valid weekday constant

	section = &models.Section{
		Day:                 time.Weekday(c.Day),
		StartTime:           startTime.Format(time.Kitchen),
		EndTime:             endTime.Format(time.Kitchen),
		Location:            c.Location,
		Capacity:            c.Capacity,
		NumStudentsEnrolled: 0,
	}

	_, err = fr.GetCourseByID(courseID)
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}

	// TODO: standardize time formating

	courseDoc := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID)
	ref, _, err := courseDoc.Collection(models.FirestoreSectionsCollection).Add(firebase.Context, map[string]interface{}{
		"day":       section.Day,
		"starttime": section.StartTime,
		"endtime":   section.EndTime,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}
	section.ID = ref.ID

	return section, nil
}
