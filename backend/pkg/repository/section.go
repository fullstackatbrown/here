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

func (fr *FirebaseRepository) initializeSectionsListener(courseID string) {
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

		course, err := fr.GetCourseByID(courseID)
		if err != nil {
			return err
		}

		course.SectionsLock.Lock()
		defer course.SectionsLock.Unlock()

		course.Sections = newSections

		return nil
	}

	done := make(chan bool)
	query := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(
		courseID).Collection(models.FirestoreSectionsCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating section collection listener: %v\n", err)
		}
	}()
	<-done
}

// GetCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetSectionByID(courseID string, sectionID string) (*models.Section, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	course.SectionsLock.RLock()
	defer course.SectionsLock.RUnlock()

	section, ok := course.Sections[sectionID]
	if !ok {
		return nil, qerrors.SectionNotFoundError
	}

	return section, nil
}

func (fr *FirebaseRepository) GetSectionByCourse(courseID string) ([]*models.Section, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	course.SectionsLock.RLock()
	defer course.SectionsLock.RUnlock()
	// TODO: check this
	sections := make([]*models.Section, 0)
	for _, section := range course.Sections {
		sections = append(sections, section)
	}

	return sections, nil
}

func (fr *FirebaseRepository) GetSectionByInfo(courseID string, startTime string, endTime string, location string) (*models.Section, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	locationCollapsed := utils.CollapseString(location)

	course.SectionsLock.RLock()
	defer course.SectionsLock.RUnlock()

	for _, section := range course.Sections {
		if section.StartTime == startTime && section.EndTime == endTime && utils.CollapseString(section.Location) == locationCollapsed {
			return section, nil
		}
	}

	return nil, nil
}

func (fr *FirebaseRepository) CreateSection(req *models.CreateSectionRequest) (section *models.Section, err error) {

	section = &models.Section{
		Day:                models.Day(req.Day),
		CourseID:           req.CourseID,
		StartTime:          req.StartTime,
		EndTime:            req.EndTime,
		Location:           req.Location,
		Capacity:           req.Capacity,
		NumEnrolled:        0,
		SwappedInStudents:  make(map[string][]string),
		SwappedOutStudents: make(map[string][]string),
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSectionsCollection).Add(firebase.Context, section)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	section.ID = ref.ID

	return section, nil
}

func (fr *FirebaseRepository) DeleteSection(req *models.DeleteSectionRequest) error {

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSectionsCollection).Doc(req.SectionID).Delete(firebase.Context)

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

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Collection(
		models.FirestoreSectionsCollection).Doc(*req.SectionID).Update(firebase.Context, updates)
	return err
}
