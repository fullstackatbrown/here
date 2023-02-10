package repository

import (
	"fmt"
	"log"

	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/mitchellh/mapstructure"
	"google.golang.org/api/iterator"
)

func (fr *FirebaseRepository) CreateSurvey(survey *models.Survey) (*models.Survey, error) {

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Add(firebase.Context, map[string]interface{}{
		"name":     survey.Name,
		"courseID": survey.CourseID,
		"capacity": survey.Capacity,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating survey: %v\n", err)
	}
	survey.ID = ref.ID

	return survey, nil
}

func (fr *FirebaseRepository) CreateSurveyResponse(c *models.CreateSurveyResponseRequest) (response *models.SurveyResponse, err error) {

	response = &models.SurveyResponse{
		UserID: c.UserID,
		Times:  c.Times,
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Doc(c.SurveyID).Collection(models.FirestoreSurveyResponsesCollection).Add(firebase.Context, map[string]interface{}{
		"userID": response.UserID,
		"times":  response.Times,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating survey: %v\n", err)
	}
	response.ID = ref.ID

	return response, nil
}

func (fr *FirebaseRepository) ListSurveyResponse(surveyID string) (responses []models.SurveyResponse, err error) {

	responses = make([]models.SurveyResponse, 0)
	iter := fr.firestoreClient.Collection(models.FirestoreSurveysCollection).Doc(surveyID).Collection(models.FirestoreSurveyResponsesCollection).Documents(firebase.Context)

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("error listing survey response: %v\n", err)
		}

		var res models.SurveyResponse
		err = mapstructure.Decode(doc.Data(), &res)
		if err != nil {
			log.Panicf("Error destructuring document: %v", err)
			return nil, err
		}
		res.ID = doc.Ref.ID
		responses = append(responses, res)
	}

	return responses, nil
}
