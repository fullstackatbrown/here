package repository

import (
	"fmt"
	"log"
	"reflect"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/mitchellh/mapstructure"
)

func (fr *FirebaseRepository) GetSwapByID(courseID string, swapID string) (*models.Swap, error) {

	doc, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSwapsCollection).Doc(swapID).Get(firebase.Context)

	if err != nil {
		return nil, err
	}

	var swap models.Swap
	err = mapstructure.Decode(doc.Data(), &swap)
	if err != nil {
		log.Panicf("Error destructuring document: %v", err)
		return nil, err
	}

	swap.ID = doc.Ref.ID

	return &swap, nil
}

func (fr *FirebaseRepository) CreateSwap(req *models.CreateSwapRequest) (*models.Swap, error) {

	swap := &models.Swap{
		StudentID:    req.StudentID,
		AssignmentID: req.AssignmentID,
		OldSectionID: req.OldSectionID,
		NewSectionID: req.NewSectionID,
		Reason:       req.Reason,
		RequestTime:  req.RequestTime,
		Status:       models.STATUS_PENDING,
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSwapsCollection).Add(firebase.Context, swap)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	swap.ID = ref.ID

	return swap, nil
}

func (fr *FirebaseRepository) UpdateSwap(req *models.UpdateSwapRequest) error {
	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()

		// Only include the fields that are set
		if (!reflect.ValueOf(val).IsNil()) && (field != "CourseID") && (field != "SwapID") && (field != "StudentID") {
			updates = append(updates, firestore.Update{Path: utils.LowercaseFirst(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Collection(
		models.FirestoreSwapsCollection).Doc(*req.SwapID).Update(firebase.Context, updates)
	return err
}

func (fr *FirebaseRepository) HandleSwap(req *models.HandleSwapRequest) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSwapsCollection).Doc(req.SwapID).Update(firebase.Context, []firestore.Update{
		{Path: "Status", Value: req.Status},
		{Path: "HandledBy", Value: req.HandledBy},
	})
	return err
}

func (fr *FirebaseRepository) CancelSwap(courseID string, swapID string) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSwapsCollection).Doc(swapID).Update(firebase.Context, []firestore.Update{
		{Path: "Status", Value: models.STATUS_CANCELLED},
	})
	return err
}
