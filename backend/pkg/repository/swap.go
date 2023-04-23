package repository

import (
	"fmt"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/golang/glog"
	"github.com/mitchellh/mapstructure"
)

func (fr *FirebaseRepository) initializePendingSwapsListener(course *models.Course, courseID string) error {
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newSwaps := make(map[string]*models.Swap)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Swap
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newSwaps[doc.Ref.ID] = &c
		}

		course.PendingSwapsLock.Lock()
		defer course.PendingSwapsLock.Unlock()

		course.PendingSwaps = newSwaps

		return nil
	}

	done := make(chan func())
	query := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(
		courseID).Collection(models.FirestoreSwapsCollection).Query.Where("status", "==", models.STATUS_PENDING)
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating assignment collection listener: %v\n", err)
		}
	}()
	cancelFunc := <-done
	course.PendingSwapsListenerCancelFunc = cancelFunc
	return nil
}

func (fr *FirebaseRepository) GetPendingSwapByID(courseID string, swapID string) (*models.Swap, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	course.PendingSwapsLock.RLock()
	defer course.PendingSwapsLock.RUnlock()

	if swap, ok := course.PendingSwaps[swapID]; ok {
		return swap, nil
	}

	return nil, qerrors.SwapNotFoundError
}

func (fr *FirebaseRepository) GetSwapByID(courseID string, swapID string) (*models.Swap, error) {
	// first look in cache
	if swap, err := fr.GetPendingSwapByID(courseID, swapID); err == nil {
		return swap, nil
	}

	// if not in cache, look in firestore
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

func (fr *FirebaseRepository) checkDuplicateSwapRequest(course *models.Course, studentID string, assignmentID string, oldSectionID string, newSectionID string) (requestErr error) {
	course.PendingSwapsLock.RLock()
	defer course.PendingSwapsLock.RUnlock()

	for _, swap := range course.PendingSwaps {
		if swap.AssignmentID == assignmentID {
			if assignmentID == "" {
				return fmt.Errorf("You already have a pending permanent swap request")
			}
			return fmt.Errorf("There exists a pending request for this assignment")
		}
		if swap.StudentID == studentID && swap.OldSectionID == oldSectionID && swap.NewSectionID == newSectionID {
			if swap.AssignmentID == "" {
				return fmt.Errorf("You have requested a permanent swap for this section")
			}

		}
	}
	return nil
}

func (fr *FirebaseRepository) checkSwapRequestDueDate(courseID string, assignmentID string) (requestErr error) {
	if assignmentID != "" {
		assignment, err := fr.GetAssignmentByID(courseID, assignmentID)
		if err != nil {
			return err
		}

		dueDate, err := time.Parse(time.RFC3339, assignment.DueDate)
		if err != nil {
			return err
		}

		if dueDate.Before(time.Now()) {
			return fmt.Errorf("Cannot swap after the assignment due date")
		}

		return nil
	}
	return nil
}

func (fr *FirebaseRepository) CreateSwap(req *models.CreateSwapRequest) (swap *models.Swap, badRequestErr error, internalErr error) {

	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, err, nil
	}

	// Check for conflicting swaps
	requestErr := fr.checkDuplicateSwapRequest(course, req.User.ID, req.AssignmentID, req.OldSectionID, req.NewSectionID)
	if requestErr != nil {
		return nil, requestErr, nil
	}

	// Check if the assignment due date has passed
	requestErr = fr.checkSwapRequestDueDate(req.CourseID, req.AssignmentID)
	if requestErr != nil {
		return nil, requestErr, nil
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

func (fr *FirebaseRepository) UpdateSwap(req *models.UpdateSwapRequest) (badRequestErr error, internalErr error) {
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err, nil
	}

	// Find the old swap
	oldSwap, err := fr.GetPendingSwapByID(req.CourseID, req.SwapID)
	if err != nil {
		return fmt.Errorf("No swap with status pending found"), nil
	}

	// Check if swap made by same user
	if oldSwap.StudentID != req.User.ID {
		return fmt.Errorf("You are not the owner of this swap"), nil
	}

	// Check for conflicting swaps
	requestErr := fr.checkDuplicateSwapRequest(course, req.User.ID, req.AssignmentID, oldSwap.OldSectionID, req.NewSectionID)
	if requestErr != nil {
		return requestErr, nil
	}

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSwapsCollection).Doc(req.SwapID).Update(firebase.Context, []firestore.Update{
		{Path: "newSectionID", Value: req.NewSectionID},
		{Path: "reason", Value: req.Reason},
		{Path: "assignmentID", Value: req.AssignmentID},
	})

	return nil, err
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
