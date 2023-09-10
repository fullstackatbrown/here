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

// CoursesLock should be locked on entry
func (fr *FirebaseRepository) initializePendingSwapsListener(course *models.Course) error {
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
		course.ID).Collection(models.FirestoreSwapsCollection).Query.Where("status", "==", models.STATUS_PENDING)
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

		if assignment.DueDate.Before(time.Now()) {
			return fmt.Errorf("Cannot swap after the assignment due date")
		}

		return nil
	}
	return nil
}

func (fr *FirebaseRepository) CreateSwap(req *models.CreateSwapRequest) (swap *models.Swap, badRequestErr error, internalErr error) {

	// Check for conflicting swaps
	requestErr := fr.checkDuplicateSwapRequest(req.Course, req.User.ID, req.AssignmentID, req.OldSectionID, req.NewSectionID)
	if requestErr != nil {
		return nil, requestErr, nil
	}

	// Check if the assignment due date has passed
	requestErr = fr.checkSwapRequestDueDate(req.Course.ID, req.AssignmentID)
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

	if req.Course.Config.AutoApproveRequests {
		// check the availability of the new section
		section, err := fr.GetSectionByID(req.Course.ID, req.NewSectionID)
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
			swap.HandledTime = time.Now()
		}

	}

	batch := fr.firestoreClient.Batch()
	var err error

	// If the swap is approved, assign the sections
	if swap.Status == models.STATUS_APPROVED {
		batch, err = fr.approveSwap(req.Course, swap)
		if err != nil {
			return nil, nil, err
		}
	}

	// Create the swap in the batch
	ref := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.Course.ID).Collection(
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
	// Find the old swap
	oldSwap, err := fr.GetPendingSwapByID(req.Course.ID, req.SwapID)
	if err != nil {
		return fmt.Errorf("No swap with status pending found"), nil
	}

	// Check if swap made by same user
	if oldSwap.StudentID != req.User.ID {
		return fmt.Errorf("You are not the owner of this swap"), nil
	}

	// Check for conflicting swaps
	requestErr := fr.checkDuplicateSwapRequest(req.Course, req.User.ID, req.AssignmentID, oldSwap.OldSectionID, req.NewSectionID)
	if requestErr != nil {
		return requestErr, nil
	}

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.Course.ID).Collection(
		models.FirestoreSwapsCollection).Doc(req.SwapID).Update(firebase.Context, []firestore.Update{
		{Path: "newSectionID", Value: req.NewSectionID},
		{Path: "reason", Value: req.Reason},
		{Path: "assignmentID", Value: req.AssignmentID},
	})

	return nil, err
}

func (fr *FirebaseRepository) HandleSwap(req *models.HandleSwapRequest) (badRequestErr error, internalError error) {
	batch := fr.firestoreClient.Batch()

	swap, err := fr.GetSwapByID(req.Course.ID, req.SwapID)
	if err != nil {
		return nil, err
	}

	// Assign sections if the swap is approved
	if req.Status == models.STATUS_APPROVED {
		// Check if student is in the course
		if _, ok := req.Course.Students[swap.StudentID]; !ok {
			return fmt.Errorf("Student is no longer enrolled in this course"), nil
		}

		batch, err = fr.approveSwap(req.Course, swap)
		if err != nil {
			return nil, err
		}
	}

	// If status was approved, but now marking as pending, undo the swap
	if req.Status == models.STATUS_PENDING && swap.Status == models.STATUS_APPROVED {
		batch, err = fr.undoSwap(req.Course, swap)
		if err != nil {
			return nil, err
		}
	}

	var handledBy string
	if req.HandledBy != nil {
		handledBy = req.HandledBy.ID
	} else {
		handledBy = "system"
	}

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.Course.ID).Collection(
		models.FirestoreSwapsCollection).Doc(req.SwapID), []firestore.Update{
		{Path: "status", Value: req.Status},
		{Path: "handledBy", Value: handledBy},
		{Path: "handledTime", Value: time.Now()},
	})

	_, err = batch.Commit(firebase.Context)

	if err != nil {
		return nil, err
	}

	course, err := fr.GetCourseByID(req.Course.ID)
	if err != nil {
		return nil, err
	}

	// Send notification to student
	msg := fmt.Sprintf("Your swap request has been %s", req.Status)
	if req.HandledBy == nil {
		msg += " by the system"
	}

	err = fr.AddNotificationWithMsg(swap.StudentID, course.Code, models.NotificationRequestUpdated, msg)
	if err != nil {
		glog.Warningf("error sending claim notification: %v\n", err)
	}

	return nil, nil

}

func (fr *FirebaseRepository) CancelSwap(courseID string, swapID string) error {
	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(courseID).Collection(
		models.FirestoreSwapsCollection).Doc(swapID).Update(firebase.Context, []firestore.Update{
		{Path: "status", Value: models.STATUS_CANCELLED},
	})
	return err
}

// Get all pending swaps from the course and mark the expired ones as archived
func (fr *FirebaseRepository) scheduleExpireSwaps() {
	now := time.Now()
	midnight := time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, now.Location())
	duration := midnight.Sub(now)

	ticker := time.NewTicker(24 * time.Hour)

	go func() {
		// wait till midnight and run once
		time.Sleep(duration)
		fr.expireSwaps()

		for {
			select {
			case <-ticker.C:
				// run every 24 hours
				fr.expireSwaps()
			}
		}
	}()
}

func (fr *FirebaseRepository) expireSwaps() {
	fr.coursesLock.RLock()
	defer fr.coursesLock.RUnlock()
	for _, course := range fr.courses {
		course.PendingSwapsLock.RLock()
		course.AssignmentsLock.RLock()

		for _, swap := range course.PendingSwaps {
			if swap.AssignmentID == "" {
				continue
			}
			assignment, ok := course.Assignments[swap.AssignmentID]
			// if assignment no longer exists or is past due date, archive swap
			if !ok || assignment.DueDate.Before(time.Now()) {
				_, err := fr.HandleSwap(&models.HandleSwapRequest{
					Course: course,
					SwapID: swap.ID,
					Status: models.STATUS_ARCHIVED,
				})
				if err != nil {
					glog.Warning("error archiving swap: %v\n", err)
				}
			}
		}

		course.PendingSwapsLock.RUnlock()
		course.AssignmentsLock.RUnlock()
	}
}
