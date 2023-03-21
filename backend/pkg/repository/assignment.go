package repository

import (
	"fmt"
	"log"
	"reflect"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/mitchellh/mapstructure"
	"github.com/relvacode/iso8601"
)

func (fr *FirebaseRepository) initializeAssignmentsListener() {
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

		fr.assignmentsLock.Lock()
		defer fr.assignmentsLock.Unlock()
		fr.assignments = newAssignments

		return nil
	}

	done := make(chan bool)
	query := fr.firestoreClient.Collection(models.FirestoreAssignmentsCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating assignments collection listner: %v\n", err)
		}
	}()
	<-done
}

// GetCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetAssignmentByID(ID string) (*models.Assignment, error) {
	fr.assignmentsLock.RLock()
	defer fr.assignmentsLock.RUnlock()

	if val, ok := fr.assignments[ID]; ok {
		return val, nil
	} else {
		return nil, qerrors.AssignmentNotFoundError
	}
}

func (fr *FirebaseRepository) GetAssignmentByCourse(courseID string) ([]*models.Assignment, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	fr.assignmentsLock.RLock()
	defer fr.assignmentsLock.RUnlock()

	assignments := make([]*models.Assignment, 0)
	for _, id := range course.AssignmentIDs {
		if assignment, ok := fr.assignments[id]; !ok {
			assignments = append(assignments, assignment)
		} else {
			return nil, qerrors.AssignmentNotFoundError
		}
	}

	return assignments, nil
}

func (fr *FirebaseRepository) CreateAssignment(req *models.CreateAssignmentRequest) (assignment *models.Assignment, err error) {
	// TODO: check assignment exists

	releaseDate, err := iso8601.ParseString(req.ReleaseDate)
	if err != nil {
		return nil, fmt.Errorf("error parsing start time: %v\n", err)
	}
	dueDate, err := iso8601.ParseString(req.DueDate)
	if err != nil {
		return nil, fmt.Errorf("error parsing end time: %v\n", err)
	}

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	// Check if an assignment with the same name already exists
	assignments, err := fr.GetAssignmentByCourse(req.CourseID)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}
	for _, a := range assignments {
		if a.Name == req.Name {
			return nil, qerrors.AssignmentAlreadyExistsError
		}
	}

	// In a transaction, create a new assignment document and add the assignment to the corresponding course
	batch := fr.firestoreClient.Batch()

	assignment = &models.Assignment{
		CourseID:        req.CourseID,
		Name:            req.Name,
		Optional:        req.Optional,
		MaxScore:        req.MaxScore,
		ReleaseDate:     releaseDate.Format(time.DateOnly),
		DueDate:         dueDate.Format(time.DateOnly),
		GradesByStudent: make(map[string]string),
	}

	assignmentRef := fr.firestoreClient.Collection(models.FirestoreAssignmentsCollection).NewDoc()
	batch.Create(assignmentRef, assignment)

	// Add the assignment to the corresponding course
	newAssignments := append(course.AssignmentIDs, assignmentRef.ID)

	coursesRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID)
	batch.Update(coursesRef, []firestore.Update{{Path: "assignmentIDs", Value: newAssignments}})

	// Commit the batch.
	_, err = batch.Commit(firebase.Context)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	assignment.ID = assignmentRef.ID
	return assignment, nil
}

func (fr *FirebaseRepository) DeleteAssignment(req *models.DeleteAssignmentRequest) error {

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}

	_, err = fr.GetAssignmentByID(req.AssignmentID)
	if err != nil {
		return err
	}

	// In a transaction, delete the assignment document and delete the assignment from course
	batch := fr.firestoreClient.Batch()
	assignmentRef := fr.firestoreClient.Collection(models.FirestoreAssignmentsCollection).Doc(req.AssignmentID)
	batch.Delete(assignmentRef)

	newAssignments := utils.Filter(course.AssignmentIDs, func(s string) bool { return s != req.AssignmentID })
	coursesRef := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID)
	batch.Update(coursesRef, []firestore.Update{{Path: "assignmentIDs", Value: newAssignments}})

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

	_, err := fr.firestoreClient.Collection(models.FirestoreAssignmentsCollection).Doc(*req.AssignmentID).Update(firebase.Context, updates)
	return err
}
