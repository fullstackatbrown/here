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

func (fr *FirebaseRepository) GetAssignmentByID(courseID string, assignmentID string) (*models.Assignment, error) {

	doc, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(assignmentID).Get(firebase.Context)

	if err != nil {
		return nil, err
	}

	var assignment models.Assignment
	err = mapstructure.Decode(doc.Data(), &assignment)
	if err != nil {
		log.Panicf("Error destructuring document: %v", err)
		return nil, err
	}

	assignment.ID = doc.Ref.ID

	return &assignment, nil
}

func (fr *FirebaseRepository) CreateAssignment(req *models.CreateAssignmentRequest) (assignment *models.Assignment, err error) {

	assignmentID := models.CreateAssignmentID(req)

	// Check if an assignment with the same name already exists
	a, err := fr.GetAssignmentByID(req.CourseID, assignmentID)
	if err == nil && a != nil {
		return nil, qerrors.AssignmentAlreadyExistsError
	}

	assignment = &models.Assignment{
		CourseID:    req.CourseID,
		Name:        req.Name,
		Optional:    req.Optional,
		MaxScore:    req.MaxScore,
		ReleaseDate: req.ReleaseDate,
		DueDate:     req.DueDate,
	}

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(assignmentID).Set(firebase.Context, assignment)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	assignment.ID = assignmentID

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
