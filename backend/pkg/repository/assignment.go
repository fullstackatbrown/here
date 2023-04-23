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

func (fr *FirebaseRepository) initializeAssignmentsListener(course *models.Course, courseID string) error {
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newAssignments := make(map[string]*models.Assignment)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Assignment
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newAssignments[doc.Ref.ID] = &c
		}

		course.AssignmentsLock.Lock()
		defer course.AssignmentsLock.Unlock()

		course.Assignments = newAssignments

		return nil
	}

	done := make(chan func())
	query := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(
		courseID).Collection(models.FirestoreAssignmentsCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating assignment collection listener: %v\n", err)
		}
	}()
	cancelFunc := <-done
	course.AssignmentsListenerCancelFunc = cancelFunc
	return nil
}

func (fr *FirebaseRepository) GetAssignmentByID(courseID string, assignmentID string) (*models.Assignment, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	course.AssignmentsLock.RLock()
	defer course.AssignmentsLock.RUnlock()

	assignment, ok := course.Assignments[assignmentID]
	if !ok {
		return nil, qerrors.AssignmentNotFoundError
	}

	return assignment, nil
}

func (fr *FirebaseRepository) GetAssignmentByName(courseID string, name string) (assignment *models.Assignment, err error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	nameCollapsed := utils.CollapseString(name)

	course.AssignmentsLock.RLock()
	defer course.AssignmentsLock.RUnlock()

	for _, assignment := range course.Assignments {
		if utils.CollapseString(assignment.Name) == nameCollapsed {
			return assignment, nil
		}
	}

	return nil, nil
}

func (fr *FirebaseRepository) CreateAssignment(req *models.CreateAssignmentRequest) (assignment *models.Assignment, err error) {

	assignment = &models.Assignment{
		CourseID:    req.CourseID,
		Name:        req.Name,
		Optional:    req.Optional,
		MaxScore:    req.MaxScore,
		ReleaseDate: req.ReleaseDate,
		DueDate:     req.DueDate,
		Grades:      make(map[string]models.Grade),
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Add(firebase.Context, assignment)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	assignment.ID = ref.ID

	return assignment, nil
}

func (fr *FirebaseRepository) DeleteAssignment(req *models.DeleteAssignmentRequest) error {

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(req.AssignmentID).Delete(firebase.Context)

	// TODO: delete all grades in the assignment
	return err
}

func (fr *FirebaseRepository) UpdateAssignment(req *models.UpdateAssignmentRequest) error {
	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()

		// Only include the fields that are set
		if (!reflect.ValueOf(val).IsNil()) && (field != "CourseID") && (field != "AssignmentID") {
			updates = append(updates, firestore.Update{Path: utils.LowercaseFirst(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(*req.AssignmentID).Update(firebase.Context, updates)
	return err
}
