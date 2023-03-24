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
	"google.golang.org/api/iterator"
)

// GetCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetSectionByID(courseID string, sectionID string) (*models.Section, error) {
	doc, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSectionsCollection).Doc(sectionID).Get(firebase.Context)

	if err != nil {
		return nil, err
	}

	var section models.Section
	err = mapstructure.Decode(doc.Data(), &section)
	if err != nil {
		log.Panicf("Error destructuring document: %v", err)
		return nil, err
	}

	section.ID = doc.Ref.ID

	return &section, nil
}

func (fr *FirebaseRepository) GetSectionByCourse(courseID string) ([]*models.Section, error) {
	var sections []*models.Section
	iter := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSectionsCollection).Documents(firebase.Context)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var section models.Section
		err = mapstructure.Decode(doc.Data(), &section)
		if err != nil {
			log.Panicf("Error destructuring document: %v", err)
			return nil, err
		}

		section.ID = doc.Ref.ID
		sections = append(sections, &section)
	}
	return sections, nil
}

func (fr *FirebaseRepository) CreateSection(req *models.CreateSectionRequest) (section *models.Section, err error) {

	sectionID, err := models.CreateSectionID(req)
	if err != nil {
		return nil, err
	}

	// Check if a section with the same name already exists
	s, err := fr.GetSectionByID(req.CourseID, sectionID)
	if err == nil && s != nil {
		return nil, qerrors.SectionAlreadyExistsError
	}

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

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSectionsCollection).Doc(sectionID).Set(firebase.Context, section)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	section.ID = sectionID

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
