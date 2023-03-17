package repository

import (
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/mitchellh/mapstructure"
)

func (fr *FirebaseRepository) initializeSurveysListener() {
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newSurveys := make(map[string]*models.Survey)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Survey
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newSurveys[doc.Ref.ID] = &c
		}

		fr.surveysLock.Lock()
		defer fr.surveysLock.Unlock()
		fr.surveys = newSurveys

		return nil
	}

	done := make(chan bool)
	query := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating surveys collection listner: %v\n", err)
		}
	}()
	<-done
}

func (fr *FirebaseRepository) GetSurveyByID(ID string) (*models.Survey, error) {
	fr.surveysLock.RLock()
	defer fr.surveysLock.RUnlock()

	if val, ok := fr.surveys[ID]; ok {
		return val, nil
	} else {
		return nil, qerrors.SurveyNotFoundError
	}
}

func (fr *FirebaseRepository) GetSurveyByCourse(courseID string) (survey *models.Survey, err error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	if course.SurveyID != "" {
		survey, err = fr.GetSurveyByID(course.SurveyID)
		if err != nil {
			return nil, err
		}
	}

	return survey, nil
}

func (fr *FirebaseRepository) CreateSurvey(survey *models.Survey) (*models.Survey, error) {

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Add(firebase.Context, survey)
	if err != nil {
		return nil, fmt.Errorf("error creating survey: %v\n", err)
	}
	survey.ID = ref.ID

	// Add the survey to the corresponding course
	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(survey.CourseID).Update(firebase.Context, []firestore.Update{
		{Path: "surveyID", Value: survey.ID},
	})

	if err != nil {
		return nil, fmt.Errorf("error creating survey: %v\n", err)
	}

	return survey, nil
}

func (fr *FirebaseRepository) UpdateSurvey(surveyID string, newSurvey *models.Survey) error {

	// override existing survey
	_, err := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Doc(surveyID).Set(firebase.Context, newSurvey)

	return err
}

func (fr *FirebaseRepository) UpdateSurveyResults(surveyID string, results map[string][]string) error {

	// override existing survey
	_, err := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Doc(surveyID).Update(firebase.Context, []firestore.Update{
		{Path: "results", Value: results},
	})

	return err
}

func (fr *FirebaseRepository) PublishSurvey(surveyID string) error {

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(surveyID).Update(firebase.Context, []firestore.Update{
		{Path: "published", Value: true},
	})

	return err
}

func (fr *FirebaseRepository) CreateSurveyResponse(c *models.CreateSurveyResponseRequest) (survey *models.Survey, err error) {

	survey, err = fr.GetSurveyByID(c.SurveyID)
	if err != nil {
		return nil, fmt.Errorf("error getting survey: %v\n", err)
	}

	if survey.Responses == nil {
		survey.Responses = make(map[string][]string)
	}
	// override previous response
	survey.Responses[c.UserID] = c.Availability

	_, err = fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Doc(c.SurveyID).Update(firebase.Context, []firestore.Update{
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
