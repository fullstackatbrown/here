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

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Add(firebase.Context, map[string]interface{}{
		"name":         survey.Name,
		"courseID":     survey.CourseID,
		"capacity":     survey.Capacity,
		"responses":    survey.Responses,
		"numresponses": survey.NumResponses,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating survey: %v\n", err)
	}
	survey.ID = ref.ID

	return survey, nil
}

func (fr *FirebaseRepository) CreateSurveyResponse(c *models.CreateSurveyResponseRequest) (survey *models.Survey, err error) {

	survey, err = fr.GetSurveyByID(c.SurveyID)
	if err != nil {
		return nil, fmt.Errorf("error getting survey: %v\n", err)
	}

	if survey.Responses == nil {
		survey.Responses = make(map[string][]string)
	}
	if _, ok := survey.Responses[c.UserID]; !ok {
		survey.NumResponses += 1
	}
	// override previous response
	survey.Responses[c.UserID] = c.Availability

	_, err = fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Doc(c.SurveyID).Update(firebase.Context, []firestore.Update{
		{
			Path:  "responses",
			Value: survey.Responses,
		},
		{Path: "numresponses",
			Value: survey.NumResponses,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("error updating survey: %v\n", err)
	}

	return survey, nil
}
