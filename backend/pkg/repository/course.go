package repository

import (
	"fmt"
	"log"
	"reflect"
	"strings"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/mitchellh/mapstructure"
	"google.golang.org/api/iterator"
)

func (fr *FirebaseRepository) initializeCoursesListener() {
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newCourses := make(map[string]*models.Course)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Course
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newCourses[doc.Ref.ID] = &c
		}

		fr.coursesLock.Lock()
		defer fr.coursesLock.Unlock()
		fr.courses = newCourses

		return nil
	}

	done := make(chan bool)
	query := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating course collection listner: %v\n", err)
		}
	}()
	<-done
}

// GetCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetCourseByID(ID string) (*models.Course, error) {
	fr.coursesLock.RLock()
	defer fr.coursesLock.RUnlock()

	if val, ok := fr.courses[ID]; ok {
		return val, nil
	} else {
		return nil, qerrors.CourseNotFoundError
	}
}

func (fr *FirebaseRepository) GetCourseByInfo(code string, term string) (*models.Course, error) {
	fr.coursesLock.RLock()
	defer fr.coursesLock.RUnlock()

	for _, course := range fr.courses {
		if course.Code == code && course.Term == term {
			return course, nil
		}
	}
	return nil, qerrors.CourseNotFoundError
}

func (fr *FirebaseRepository) ListCourseSections(courseID string) (sections []models.Section, err error) {
	// TODO: add listener for sections

	// fr.coursesLock.RLock()
	// defer fr.coursesLock.RUnlock()

	// if val, ok := fr.courses[courseID]; ok {
	// 	return &val.Sections, nil
	// } else {
	// 	return nil, qerrors.CourseNotFoundError
	// }

	iter := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(models.FirestoreSectionsCollection).Documents(firebase.Context)

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("error listing course sections: %v\n", err)
		}

		var c models.Section
		err = mapstructure.Decode(doc.Data(), &c)
		if err != nil {
			log.Panicf("Error destructuring document: %v", err)
			return nil, err
		}
		c.ID = doc.Ref.ID
		sections = append(sections, c)
	}
	return sections, nil
}

func (fr *FirebaseRepository) CreateCourse(req *models.CreateCourseRequest) (course *models.Course, err error) {
	// TODO: check if course already exists
	course = &models.Course{
		Title:         req.Title,
		Code:          req.Code,
		Term:          req.Term,
		SectionIDs:    make([]string, 0),
		AssignmentIDs: make([]string, 0),
		GradeOptions:  models.DefaultGradeOptions,
		Students:      make(map[string]string),
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Add(firebase.Context, course)
	if err != nil {
		return nil, fmt.Errorf("error creating course: %v\n", err)
	}
	course.ID = ref.ID

	return course, nil
}

func (fr *FirebaseRepository) DeleteCourse(req *models.DeleteCourseRequest) error {
	_, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}
	// Delete the course.
	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Delete(firebase.Context)
	return err
}

func (fr *FirebaseRepository) UpdateCourse(req *models.UpdateCourseRequest) error {

	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()
		// Only include the fields that are set
		if (!reflect.ValueOf(val).IsNil()) && (field != "CourseID") {
			updates = append(updates, firestore.Update{Path: strings.ToLower(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Update(firebase.Context, updates)
	return err
}
