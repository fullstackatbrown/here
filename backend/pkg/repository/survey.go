package repository

import (
	"fmt"
	"log"
	"reflect"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/golang/glog"
	"github.com/mitchellh/mapstructure"
	"google.golang.org/api/iterator"
)

func (fr *FirebaseRepository) GetSurveyByID(courseID string, surveyID string) (*models.Survey, error) {
	doc, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSurveysCollection).Doc(surveyID).Get(firebase.Context)

	if err != nil {
		return nil, err
	}

	var survey models.Survey
	err = mapstructure.Decode(doc.Data(), &survey)
	if err != nil {
		log.Panicf("Error destructuring document: %v", err)
		return nil, err
	}

	survey.ID = doc.Ref.ID
	return &survey, nil
}

func (fr *FirebaseRepository) GetSurveyByCourse(courseID string) (survey *models.Survey, err error) {
	iter := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSurveysCollection).Documents(firebase.Context)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var survey models.Survey
		err = mapstructure.Decode(doc.Data(), &survey)
		if err != nil {
			log.Panicf("Error destructuring document: %v", err)
			return nil, err
		}

		survey.ID = doc.Ref.ID
		// Guaranteed to have only one survey
		return &survey, nil

	}

	return nil, nil
}

func (fr *FirebaseRepository) CreateSurvey(req *models.CreateSurveyRequest) (*models.Survey, error) {

	survey := &models.Survey{
		Name:        req.Name,
		Description: req.Description,
		EndTime:     req.EndTime,
		CourseID:    req.CourseID,
		Options:     req.Options,
		Published:   false,
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSurveysCollection).Add(firebase.Context, survey)
	if err != nil {
		return nil, fmt.Errorf("error creating survey: %v\n", err)
	}

	survey.ID = ref.ID

	return survey, nil
}

func (fr *FirebaseRepository) UpdateSurvey(req *models.UpdateSurveyRequest) error {
	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()

		// Only include the fields that are set
		if (field != "CourseID") && (field != "SurveyID") && (!reflect.ValueOf(val).IsNil()) {
			updates = append(updates, firestore.Update{Path: utils.LowercaseFirst(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Collection(
		models.FirestoreSurveysCollection).Doc(*req.SurveyID).Update(firebase.Context, updates)
	return err
}

func (fr *FirebaseRepository) PublishSurvey(courseID string, surveyID string) error {

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSurveysCollection).Doc(surveyID).Update(firebase.Context, []firestore.Update{
		{Path: "published", Value: true},
	})
	return err
}

func (fr *FirebaseRepository) DeleteSurvey(courseID string, surveyID string) error {

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSurveysCollection).Doc(surveyID).Delete(firebase.Context)

	return err
}

func (fr *FirebaseRepository) UpdateSurveyResults(courseID string, surveyID string, results map[string][]string) error {
	finalRes := make(map[string][]models.CourseUserData)

	for option, studentIDs := range results {
		students := make([]models.CourseUserData, 0)
		for _, studentID := range studentIDs {
			student, err := fr.GetProfileById(studentID)
			if err != nil {
				// student no longer exists
				// TODO: handle error, maybe remove from results
				continue
			}
			students = append(students, models.CourseUserData{
				StudentID:   studentID,
				Email:       student.Email,
				DisplayName: student.DisplayName,
			})
		}
		finalRes[option] = students
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSurveysCollection).Doc(surveyID).Update(firebase.Context, []firestore.Update{
		{Path: "results", Value: finalRes},
	})
	return err

}

func (fr *FirebaseRepository) ApplySurveyResults(course *models.Course, surveyID string) error {
	survey, err := fr.GetSurveyByID(course.ID, surveyID)
	if err != nil {
		return fmt.Errorf("error getting survey: %v\n", err)
	}

	// survey.results is a map of sectionID to a list of userIDs
	// assign every student to the section

	for option, students := range survey.Results {
		for _, student := range students {

			batch, err := fr.assignPermanentSection(&models.AssignSectionsRequest{
				Course:       course,
				StudentID:    student.StudentID,
				NewSectionID: option,
			})

			if err != nil {
				continue
			}

			if _, err := batch.Commit(firebase.Context); err != nil {
				glog.Warningf("error assigning section for student %s: %v", student.StudentID, err)
				continue
			}
		}
	}

	return nil
}

// Returns the survey if active
func (fr *FirebaseRepository) ValidateSurveyActive(courseID string, surveyID string) (survey *models.Survey, badRequestErr error, internalErr error) {
	survey, err := fr.GetSurveyByID(courseID, surveyID)
	if err != nil {
		return nil, nil, fmt.Errorf("error getting survey: %v\n", err)
	}

	// check if survey is published
	if survey.Published == false {
		return nil, fmt.Errorf("survey is not published"), nil
	}

	// check if survey ended
	surveyEndTime, err := time.Parse(time.RFC3339, survey.EndTime)
	if err != nil {
		return nil, nil, fmt.Errorf("error parsing survey end time: %v\n", err)
	}
	if surveyEndTime.Before(time.Now()) {
		return nil, fmt.Errorf("survey has ended"), nil
	}

	return survey, nil, nil
}

func (fr *FirebaseRepository) CreateSurveyResponse(req *models.CreateSurveyResponseRequest) (survey *models.Survey, err error) {

	survey = req.Survey
	if survey.Responses == nil {
		survey.Responses = make(map[string][]string)
	}
	// override previous response
	survey.Responses[req.User.ID] = req.Availability

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSurveysCollection).Doc(req.Survey.ID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "responses",
			Value: survey.Responses,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("error creating survey response: %v\n", err)
	}
	return survey, nil
}

func (fr *FirebaseRepository) GetSurveyResponses(courseID string, surveyID string) (responses []models.SurveyResponse, err error) {
	survey, err := fr.GetSurveyByID(courseID, surveyID)
	if err != nil {
		return nil, fmt.Errorf("error getting survey: %v\n", err)
	}

	responses = make([]models.SurveyResponse, 0)
	for studentID, availability := range survey.Responses {
		student, err := fr.GetProfileById(studentID)
		if err != nil {
			// if a student no longer exist, skip
			continue
		}

		responses = append(responses, models.SurveyResponse{
			Name:         student.DisplayName,
			Email:        student.Email,
			Availability: availability,
		})
	}

	return responses, nil
}
