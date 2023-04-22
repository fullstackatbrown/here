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

	gradeID := req.GradeID
	if req.GradeID == "" {
		gradeID = models.CreateGradeID(req)
	}

	grade := &models.Grade{
		StudentID:    req.StudentID,
		Grade:        req.Grade,
		GradedBy:     req.GradedBy.ID,
		TimeUpdated:  time.Now().Format(models.ISO8601TimeFormat),
		CourseID:     req.CourseID,
		AssignmentID: req.AssignmentID,
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(req.AssignmentID).Collection(
		models.FirestoreGradesCollection).Doc(gradeID).Set(firebase.Context, grade)
	if err != nil {
		return nil, fmt.Errorf("error creating grade: %v\n", err)
	}

	grade.ID = gradeID

	// Send a notification to the student
	fr.sendUpdateGradeNotification(req.CourseID, req.StudentID)

	return grade, nil
}

func (fr *FirebaseRepository) UpdateGrade(req *models.UpdateGradeRequest) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(req.AssignmentID).Collection(
		models.FirestoreGradesCollection).Doc(req.GradeID).Update(firebase.Context, []firestore.Update{
		{Path: "grade", Value: req.Grade},
		{Path: "gradedBy", Value: req.GradedBy.ID},
	})

	if err != nil {
		return fmt.Errorf("error updating grade: %v\n", err)
	}

	// Send a notification to the student
	fr.sendUpdateGradeNotification(req.CourseID, req.StudentID)

	return nil
}

func (fr *FirebaseRepository) DeleteGrade(req *models.DeleteGradeRequest) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreAssignmentsCollection).Doc(req.AssignmentID).Collection(
		models.FirestoreGradesCollection).Doc(req.GradeID).Delete(firebase.Context)
	if err != nil {
		return fmt.Errorf("error deleting grade: %v\n", err)
	}

	return nil
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
