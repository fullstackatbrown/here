package repository

import (
	"fmt"
	"log"
	"reflect"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/mitchellh/mapstructure"
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
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}

	// In a transaction, create a new section document and add the section to the corresponding course
	section = &models.Section{
		Day:                models.Day(req.Day),
		CourseID:           req.CourseID,
		StartTime:          req.StartTime,
		EndTime:            req.EndTime,
		Location:           req.Location,
		Capacity:           req.Capacity,
		EnrolledStudents:   make([]string, 0),
		SwappedInStudents:  make(map[string][]string),
		SwappedOutStudents: make(map[string][]string),
	}

	batch := fr.firestoreClient.Batch()
	sectionRef := fr.firestoreClient.Collection(models.FirestoreSectionsCollection).NewDoc()
	batch.Create(sectionRef, section)

	courseRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID)
	batch.Update(courseRef, []firestore.Update{
		{Path: "sectionIDs", Value: append(course.SectionIDs, sectionRef.ID)},
	})

	_, err = batch.Commit(firebase.Context)
	if err != nil {
		return nil, fmt.Errorf("error creating section: %v\n", err)
	}

	section.ID = sectionRef.ID

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

	// In a transaction, delete the section document and remove the section from the corresponding course

	batch := fr.firestoreClient.Batch()
	sectionsRef := fr.firestoreClient.Collection(models.FirestoreSectionsCollection).Doc(req.SectionID)
	batch.Delete(sectionsRef)

	courseRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID)
	batch.Update(courseRef, []firestore.Update{
		{Path: "sectionIDs", Value: utils.Filter(course.SectionIDs, func(s string) bool { return s != req.SectionID })},
	})

	_, err = batch.Commit(firebase.Context)
	if err != nil {
		return fmt.Errorf("error deleting course: %v\n", err)
	}

	return err
}

func (fr *FirebaseRepository) UpdateSection(req *models.UpdateSectionRequest) error {

	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()

		// Only include the fields that are set
		if (!reflect.ValueOf(val).IsNil()) && (field != "CourseID") && (field != "SectionID") {
			updates = append(updates, firestore.Update{Path: utils.LowercaseFirst(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreSectionsCollection).Doc(*req.SectionID).Update(firebase.Context, updates)
	return err
}
