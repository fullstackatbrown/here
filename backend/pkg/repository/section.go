package repository

import (
	"fmt"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/fullstackatbrown/here/pkg/utils"
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
			log.Panicf("error creating sections collection listner: %v\n", err)
		}
	}()
	<-done
}

// GetCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetSectionByID(ID string) (*models.Section, error) {
	fr.sectionsLock.RLock()
	defer fr.sectionsLock.RUnlock()

	if val, ok := fr.sections[ID]; ok {
		return val, nil
	} else {
		return nil, qerrors.SectionNotFoundError
	}
}

func (fr *FirebaseRepository) GetSectionByCourse(courseID string) ([]*models.Section, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	sections := make([]*models.Section, 0)
	for _, sectionID := range course.SectionIDs {
		section, err := fr.GetSectionByID(sectionID)
		if err != nil {
			return nil, err
		}
		sections = append(sections, section)
	}

	return sections, nil
}

func (fr *FirebaseRepository) CreateSection(req *models.CreateSectionRequest) (section *models.Section, err error) {
	startTime, err := iso8601.ParseString(req.StartTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing start time: %v\n", err)
	}
	endTime, err := iso8601.ParseString(req.EndTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing end time: %v\n", err)
	}

	// TODO: check if c.Day is a valid weekday constant
	// TODO: make this a transaction

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}

	// Create a new section document
	section = &models.Section{
		Day:                models.Day(req.Day),
		CourseID:           req.CourseID,
		StartTime:          startTime.Format(time.Kitchen),
		EndTime:            endTime.Format(time.Kitchen),
		Location:           req.Location,
		Capacity:           req.Capacity,
		EnrolledStudents:   make([]string, 0),
		SwappedInStudents:  make(map[string][]string),
		SwappedOutStudents: make(map[string][]string),
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreSectionsCollection).Add(firebase.Context, section)
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}
	section.ID = ref.ID

	// Add the section to the corresponding course
	newSections := append(course.SectionIDs, section.ID)

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Update(firebase.Context, []firestore.Update{
		{Path: "sectionIDs", Value: newSections},
	})

	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}

	return section, nil
}

func (fr *FirebaseRepository) DeleteSection(req *models.DeleteSectionRequest) error {

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}

	_, err = fr.GetSectionByID(req.SectionID)
	if err != nil {
		return err
	}

	// TODO: make this a transaction
	// Delete the section.
	_, err = fr.firestoreClient.Collection(models.FirestoreSectionsCollection).Doc(req.SectionID).Delete(firebase.Context)
	if err != nil {
		return err
	}

	// Delete the section from course
	newSections := utils.Filter(course.SectionIDs, func(s string) bool { return s != req.SectionID })
	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Update(firebase.Context, []firestore.Update{
		{Path: "sectionIDs", Value: newSections},
	})

	return err
}
