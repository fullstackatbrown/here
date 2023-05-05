package repository

import (
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/golang/glog"
)

func (fr *FirebaseRepository) CreateGrade(req *models.CreateGradeRequest) (*models.Grade, error) {

	grade := &models.Grade{
		StudentID:   req.StudentID,
		Grade:       req.Grade,
		GradedBy:    req.GradedBy.ID,
		TimeUpdated: time.Now().Format(models.ISO8601TimeFormat),
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(req.AssignmentID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "grades." + req.StudentID,
			Value: grade,
		},
	})

	if err != nil {
		return nil, fmt.Errorf("error creating grade: %v\n", err)
	}

	// Send a notification to the student
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, err
	}

	title := fmt.Sprintf("%s: Your grade has been released", course.Code)
	err = fr.AddNotification(req.StudentID, title, "", models.NotificationGradeUpdated)
	if err != nil {
		glog.Warningf("error sending claim notification: %v\n", err)
	}

	return grade, nil
}

func (fr *FirebaseRepository) DeleteGrade(req *models.DeleteGradeRequest) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(req.AssignmentID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "grades." + req.GradeID,
			Value: firestore.Delete,
		},
	})

	return err
}
