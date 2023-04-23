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

func (fr *FirebaseRepository) CreateSwap(req *models.CreateSwapRequest) (swap *models.Swap, badRequestErr error, internalErr error) {

	// TODO: Check for conflicting swaps
	// If there exists a swap for the exact same student, assignment, old section, and new section, return an error

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, err, nil
	}

	// check assignment due date
	assignment, err := fr.GetAssignmentByID(req.CourseID, req.AssignmentID)
	if err != nil {
		return nil, err, nil
	}

	dueDate, err := time.Parse(time.RFC3339, assignment.DueDate)
	if err != nil {
		return nil, nil, err
	}

	if dueDate.Before(time.Now()) {
		return nil, fmt.Errorf("Cannot swap after the assignment due date"), nil
	}

	swap = &models.Swap{
		StudentID:    req.User.ID,
		StudentName:  req.User.DisplayName,
		AssignmentID: req.AssignmentID,
		OldSectionID: req.OldSectionID,
		NewSectionID: req.NewSectionID,
		Reason:       req.Reason,
		RequestTime:  time.Now(),
		Status:       models.STATUS_PENDING,
	}

	if course.AutoApproveRequests {
		// check the availability of the new section
		section, err := fr.GetSectionByID(course.ID, req.NewSectionID)
		if err != nil {
			return nil, err, nil
		}

		enrolled := section.NumEnrolled
		if req.AssignmentID != "" {
			if swappedIn, ok := section.SwappedInStudents[req.AssignmentID]; ok {
				enrolled += len(swappedIn)
			}
			if swappedOut, ok := section.SwappedOutStudents[req.AssignmentID]; ok {
				enrolled -= len(swappedOut)
			}
		}

		if enrolled < section.Capacity {
			// auto approve the swap
			swap.Status = models.STATUS_APPROVED
		}

	}

	batch := fr.firestoreClient.Batch()

	// If the swap is approved, assign the sections
	if swap.Status == models.STATUS_APPROVED {
		batch, err = fr.approveSwap(req.CourseID, swap)
		if err != nil {
			return nil, nil, err
		}
	}

	// Create the swap in the batch
	ref := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSwapsCollection).NewDoc()
	batch.Create(ref, swap)

	// Commit the batch
	_, err = batch.Commit(firebase.Context)
	if err != nil {
		return nil, nil, err
	}

	swap.ID = ref.ID

	return swap, nil, nil
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

	updates = append(updates, firestore.Update{Path: "requestTime", Value: time.Now()})

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Collection(
		models.FirestoreSwapsCollection).Doc(*req.SwapID).Update(firebase.Context, updates)
	return err
}

func (fr *FirebaseRepository) HandleSwap(req *models.HandleSwapRequest) error {
	batch := fr.firestoreClient.Batch()

	swap, err := fr.GetSwapByID(req.CourseID, req.SwapID)
	if err != nil {
		return err
	}

	// Assign sections if the swap is approved
	if req.Status == models.STATUS_APPROVED {
		batch, err = fr.approveSwap(req.CourseID, swap)
		if err != nil {
			return err
		}
	}

	// If status was approved, but now marking as pending, undo the swap
	if req.Status == models.STATUS_PENDING && swap.Status == models.STATUS_APPROVED {
		if swap.AssignmentID == "" {
			// Permanent Swap
			batch, err = fr.assignPermanentSection(&models.AssignSectionsRequest{
				CourseID:     req.CourseID,
				StudentID:    swap.StudentID,
				NewSectionID: swap.OldSectionID,
			})
			if err != nil {
				return err
			}

		} else {
			// Temporary Swap
			batch, err = fr.assignTemporarySection(&models.AssignSectionsRequest{
				CourseID:     req.CourseID,
				StudentID:    swap.StudentID,
				OldSectionID: swap.NewSectionID,
				NewSectionID: swap.OldSectionID,
				AssignmentID: swap.AssignmentID,
			})

		}
	}

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSwapsCollection).Doc(req.SwapID), []firestore.Update{
		{Path: "status", Value: req.Status},
		{Path: "handledBy", Value: req.HandledBy.ID},
	})

	_, err = batch.Commit(firebase.Context)

	if err != nil {
		return err
	}

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}

	notification := models.Notification{
		Title:     "Your swap request status has been updated",
		Body:      course.Code,
		Timestamp: time.Now(),
		Type:      models.NotificationRequestUpdated,
	}
	err = fr.AddNotification(swap.StudentID, notification)
	if err != nil {
		glog.Warningf("error sending claim notification: %v\n", err)
	}

	return nil

}

func (fr *FirebaseRepository) CancelSwap(courseID string, swapID string) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSwapsCollection).Doc(swapID).Update(firebase.Context, []firestore.Update{
		{Path: "status", Value: models.STATUS_CANCELLED},
	})
	return err
}
