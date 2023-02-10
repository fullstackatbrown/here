package repository

import (
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/mitchellh/mapstructure"
)

func (fr *FirebaseRepository) GetSurveyByID(ID string) (*models.Survey, error) {

	doc, err := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Doc(ID).Get(firebase.Context)
	if err != nil {
		return nil, err
	}

	var s models.Survey
	err = mapstructure.Decode(doc.Data(), &s)
	if err != nil {
		log.Panicf("Error destructuring document: %v", err)
		return nil, err
	}

	s.ID = doc.Ref.ID

	return &s, nil
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
	// override previous response
	survey.Responses[c.UserID] = c.Availability
	survey.NumResponses += 1

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
