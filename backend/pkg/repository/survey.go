package repository

import (
	"fmt"

	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
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
