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
	fr.sendUpdateGradeNotification(req.CourseID, req.StudentID)

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

func (fr *FirebaseRepository) sendUpdateGradeNotification(courseID string, studentID string) error {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return err
	}

	notification := models.Notification{
		Title:     "Your grade has been updated",
		Body:      course.Code,
		Timestamp: time.Now(),
		Type:      models.NotificationGradeUpdated,
	}

	err = fr.AddNotification(studentID, notification)
	if err != nil {
		glog.Warningf("error sending claim notification: %v\n", err)
	}

	return nil
}
