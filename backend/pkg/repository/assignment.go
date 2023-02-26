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

	assignments := make([]*models.Assignment, 0)
	for _, id := range course.AssignmentIDs {
		assignment, err := fr.GetAssignmentByID(id)
		if err != nil {
			return nil, err
		}
		assignments = append(assignments, assignment)
	}

	return assignments, nil

}

func (fr *FirebaseRepository) CreateAssignment(req *models.CreateAssignmentRequest) (assignment *models.Assignment, err error) {
	// TODO: check assignment exists

	startDate, err := iso8601.ParseString(req.StartDate)
	if err != nil {
		return nil, fmt.Errorf("error parsing start time: %v\n", err)
	}
	endDate, err := iso8601.ParseString(req.EndDate)
	if err != nil {
		return nil, fmt.Errorf("error parsing end time: %v\n", err)
	}

	// TODO: make this a transaction

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	// Create a new assignment document
	assignment = &models.Assignment{
		CourseID:        req.CourseID,
		Name:            req.Name,
		Mandatory:       req.Mandatory,
		StartDate:       startDate.Format(time.DateOnly),
		EndDate:         endDate.Format(time.DateOnly),
		GradesByStudent: make(map[string]string),
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreAssignmentsCollection).Add(firebase.Context, assignment)
	if err != nil {
		return nil, fmt.Errorf("error creating course: %v\n", err)
	}
	assignment.ID = ref.ID

	// Add the assignment to the corresponding course
	newAssignments := append(course.AssignmentIDs, assignment.ID)

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Update(firebase.Context, []firestore.Update{
		{Path: "assignmentIDs", Value: newAssignments},
	})

	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

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

	// TODO: make this a transaction
	// Delete the assignment.
	_, err = fr.firestoreClient.Collection(models.FirestoreAssignmentsCollection).Doc(req.AssignmentID).Delete(firebase.Context)
	if err != nil {
		return err
	}

	// Delete the assignment from course
	newAssignments := utils.Filter(course.AssignmentIDs, func(s string) bool { return s != req.AssignmentID })
	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Update(firebase.Context, []firestore.Update{
		{Path: "assignmentIDs", Value: newAssignments},
	})

	return err
}