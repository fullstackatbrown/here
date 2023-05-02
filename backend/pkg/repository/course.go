package repository

import (
	"fmt"
	"log"
	"reflect"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/golang/glog"
	"github.com/mitchellh/mapstructure"
	"google.golang.org/api/iterator"
)

func (fr *FirebaseRepository) initializeCoursesListener() {
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newCourses := make(map[string]*models.Course)
		newCoursesEntryCodes := make(map[string]*models.Course)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Course
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newCourses[doc.Ref.ID] = &c
			newCoursesEntryCodes[c.EntryCode] = &c
		}

		fr.coursesLock.Lock()
		fr.coursesEntryCodesLock.Lock()

		oldCourses := fr.courses

		for courseID, course := range newCourses {
			if _, ok := oldCourses[courseID]; !ok {
				// For newly added courses (e.g. just set to active), initialize the sections and assignments listeners
				fr.courses[courseID] = course
				fr.coursesEntryCodes[course.EntryCode] = course
				log.Printf("Initializing listeners for course %s with address %p", course.Code, course)
				err := fr.initializeSectionsListener(course)
				if err != nil {
					return fmt.Errorf("error initializing sections listener for course %s: %v", course.Code, err)
				}
				err = fr.initializeAssignmentsListener(course)
				if err != nil {
					return fmt.Errorf("error initializing assignments listener for course %s: %v", course.Code, err)
				}
				err = fr.initializePendingSwapsListener(course)
				if err != nil {
					return fmt.Errorf("error initializing pending swaps listener for course %s: %v", course.Code, err)
				}
			} else {
				// For existing courses, update the existing course with the new data
				err := utils.UpdateStruct(oldCourses[courseID], course, models.CourseFieldsToExclude)
				if err != nil {
					return fmt.Errorf("error updating for course %s", course.Code)
				}
			}
		}

		// If a course is newly removed from the list (e.g. just set to inactive),
		// cancel the sections and assignments listeners
		// remove the course from the courses map
		for id, course := range oldCourses {
			if _, ok := newCourses[id]; !ok {
				log.Printf("Cancelling listeners for course %s", course.Code)
				course.SectionsListenerCancelFunc()
				course.AssignmentsListenerCancelFunc()
				course.PendingSwapsListenerCancelFunc()
				delete(fr.courses, id)
				delete(fr.coursesEntryCodes, course.EntryCode)
			}
		}

		fr.coursesEntryCodesLock.Unlock()
		fr.coursesLock.Unlock()

		return nil
	}

	done := make(chan func())
	query := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Query.Where("status", "==", models.CourseActive)
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating course collection listener: %v\n", err)
		}
	}()
	<-done
}

// GetCourseByID gets the Course corresponding to the provided course ID.
// If the course is not in the cache, it will be fetched from Firestore.
func (fr *FirebaseRepository) GetCourseByID(ID string) (*models.Course, error) {
	fr.coursesLock.RLock()
	defer fr.coursesLock.RUnlock()

	if val, ok := fr.courses[ID]; ok {
		// first look in cache
		return val, nil
	} else {
		// if not in cache, look in firestore
		doc, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(ID).Get(firebase.Context)
		if !doc.Exists() {
			return nil, qerrors.CourseNotFoundError
		} else if err != nil {
			return nil, err
		}

		var c models.Course
		err = mapstructure.Decode(doc.Data(), &c)
		if err != nil {
			log.Panicf("Error destructuring document: %v", err)
			return nil, err
		}
		c.ID = doc.Ref.ID
		return &c, nil
	}
}

// GetActiveCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetActiveCourseByID(ID string) (*models.Course, error) {
	fr.coursesLock.RLock()
	defer fr.coursesLock.RUnlock()

	if val, ok := fr.courses[ID]; ok {
		return val, nil
	} else {
		return nil, qerrors.CourseNotFoundOrNonactiveError
	}
}

func (fr *FirebaseRepository) GetCourseByInfo(code string, term string) (*models.Course, error) {
	fr.coursesLock.RLock()
	defer fr.coursesLock.RUnlock()

	for _, course := range fr.courses {
		if course.Code == code && course.Term == term {
			return course, nil
		}
	}
	return nil, qerrors.CourseNotFoundError
}

// will only return active courses
func (fr *FirebaseRepository) GetCourseByEntryCode(entryCode string) (*models.Course, error) {
	fr.coursesEntryCodesLock.RLock()
	defer fr.coursesEntryCodesLock.RUnlock()

	if course, ok := fr.coursesEntryCodes[entryCode]; ok {
		return course, nil
	} else {
		return nil, qerrors.InvalidEntryCodeError
	}
}

func (fr *FirebaseRepository) checkUniqueEntryCode(entryCode string) bool {
	fr.coursesEntryCodesLock.RLock()
	defer fr.coursesEntryCodesLock.RUnlock()

	_, ok := fr.coursesEntryCodes[entryCode]
	return !ok
}

func (fr *FirebaseRepository) CreateCourse(req *models.CreateCourseRequest) (course *models.Course, err error) {

	var entryCode string
	for {
		entryCode = utils.GenerateCourseEntryCode()
		if fr.checkUniqueEntryCode(entryCode) {
			break
		}
	}

	course = &models.Course{
		Title:               req.Title,
		Code:                req.Code,
		Term:                req.Term,
		EntryCode:           entryCode,
		AutoApproveRequests: false,
		Status:              models.CourseInactive,
		Students:            map[string]models.CourseUserData{},
		Permissions:         map[string]models.CoursePermission{},
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Add(firebase.Context, course)
	if err != nil {
		return nil, fmt.Errorf("error creating course: %v\n", err)
	}
	course.ID = ref.ID

	return course, nil
}

func (fr *FirebaseRepository) DeleteCourse(req *models.DeleteCourseRequest) error {
	// 1. First delete the course from all students currently registered for the course
	// 2. Delete the course
	// 3. Delete all relevant invites
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}

	for studentID, _ := range course.Students {
		studentRef := fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(studentID)
		_, err := studentRef.Update(firebase.Context, []firestore.Update{
			{Path: "courses", Value: firestore.ArrayRemove(req.CourseID)},
			{Path: "defaultSections." + req.CourseID, Value: firestore.Delete},
			{Path: "actualSections." + req.CourseID, Value: firestore.Delete},
		})
		if err != nil {
			glog.Warningf("Error removing course from student %s: %v", studentID, err)
		}
	}

	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Delete(firebase.Context)
	if err != nil {
		return err
	}

	// TODO: delete permissions for the course from users

	// Delete all invites for the course
	iter := fr.firestoreClient.Collection(models.FirestoreInvitesCollection).Where("courseID", "==", req.CourseID).Documents(firebase.Context)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			glog.Warningf("Error iterating over invites for course %s: %v", req.CourseID, err)
			break
		}
		_, err = doc.Ref.Delete(firebase.Context)
		if err != nil {
			glog.Warningf("Error deleting invite %s: %v", doc.Ref.ID, err)
		}
	}

	return nil
}

func (fr *FirebaseRepository) UpdateCourse(req *models.UpdateCourseRequest) error {
	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()
		// Only include the fields that are set
		if (!reflect.ValueOf(val).IsNil()) && (field != "CourseID") {
			updates = append(updates, firestore.Update{Path: utils.LowercaseFirst(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Update(firebase.Context, updates)
	return err
}

func (fr *FirebaseRepository) UpdateCourseInfo(req *models.UpdateCourseInfoRequest) error {
	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()
		// Only include the fields that are set
		if (!reflect.ValueOf(val).IsNil()) && (field != "CourseID") {
			updates = append(updates, firestore.Update{Path: utils.LowercaseFirst(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(*req.CourseID).Update(firebase.Context, updates)
	return err
}

func (fr *FirebaseRepository) AssignStudentToSection(req *models.AssignSectionsRequest) error {
	batch, err := fr.assignPermanentSection(req)
	if err != nil {
		return err
	}

	_, err = batch.Commit(firebase.Context)
	return err
}

func (fr *FirebaseRepository) RemoveStudentFromSection(req *models.AssignSectionsRequest) error {
	batch, err := fr.removePermanentSection(req)
	if err != nil {
		return err
	}

	_, err = batch.Commit(firebase.Context)
	return err
}

// Helpers
func (fr *FirebaseRepository) approveSwap(courseID string, swap *models.Swap) (batch *firestore.WriteBatch, err error) {
	if swap.AssignmentID == "" {
		// Permanent Swap
		batch, err = fr.assignPermanentSection(&models.AssignSectionsRequest{
			CourseID:     courseID,
			StudentID:    swap.StudentID,
			NewSectionID: swap.NewSectionID,
		})
		return
	} else {
		// Temporary Swap
		batch, err = fr.assignTemporarySection(&models.AssignSectionsRequest{
			CourseID:     courseID,
			StudentID:    swap.StudentID,
			OldSectionID: swap.OldSectionID,
			NewSectionID: swap.NewSectionID,
			AssignmentID: swap.AssignmentID,
		})
		return
	}
}

func (fr *FirebaseRepository) assignPermanentSection(req *models.AssignSectionsRequest) (*firestore.WriteBatch, error) {
	// In a batch
	// 1. Update the course.students map
	// 2. decrease the enrolled count of the old section, if it exists
	// 3. increase the enrolled count of the new section
	// 4. update the student's default section
	batch := fr.firestoreClient.Batch()

	// get the course.students object from the course document
	course, err := fr.GetActiveCourseByID(req.CourseID)
	if err != nil {
		return nil, err
	}

	oldSectionID := course.Students[req.StudentID].DefaultSection

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID),
		[]firestore.Update{
			{Path: "students." + req.StudentID + ".defaultSection", Value: req.NewSectionID},
		})

	if oldSectionID != "" {
		batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(
			req.CourseID).Collection(models.FirestoreSectionsCollection).Doc(oldSectionID), []firestore.Update{
			{Path: "numEnrolled", Value: firestore.Increment(-1)},
		})
	}

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(
		req.CourseID).Collection(models.FirestoreSectionsCollection).Doc(req.NewSectionID), []firestore.Update{
		{Path: "numEnrolled", Value: firestore.Increment(1)},
	})

	batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.StudentID),
		[]firestore.Update{
			{Path: "defaultSections." + req.CourseID, Value: req.NewSectionID},
		})

	return batch, nil
}

func (fr *FirebaseRepository) removePermanentSection(req *models.AssignSectionsRequest) (*firestore.WriteBatch, error) {
	// In a batch
	// 1. Update the course.students map
	// 2. decrease the enrolled count of the old section, if it exists
	// 3. update the student's default section
	batch := fr.firestoreClient.Batch()

	// get the course.students object from the course document
	course, err := fr.GetActiveCourseByID(req.CourseID)
	if err != nil {
		return nil, err
	}

	oldSectionID := course.Students[req.StudentID].DefaultSection

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID),
		[]firestore.Update{
			{Path: "students." + req.StudentID + ".defaultSection", Value: firestore.Delete},
		})

	if oldSectionID != "" {
		batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(
			req.CourseID).Collection(models.FirestoreSectionsCollection).Doc(oldSectionID), []firestore.Update{
			{Path: "numEnrolled", Value: firestore.Increment(-1)},
		})
	}

	batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.StudentID),
		[]firestore.Update{
			{Path: "defaultSections." + req.CourseID, Value: firestore.Delete},
		})

	return batch, nil
}

func (fr *FirebaseRepository) assignTemporarySection(req *models.AssignSectionsRequest) (*firestore.WriteBatch, error) {
	// In a batch
	// 1. for the old section, add the student to the swappedOutStudents map
	// 2. for the new section, delete the student from the swappedOutStudents map (regardless of whether the student was in the map or not)
	// 3. Check if new section is the student's default section
	//    If it not, add the student to the swappedInStudents map, update the student's actual section
	//    If it is, remove the entry from student's actual section

	batch := fr.firestoreClient.Batch()

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSectionsCollection).Doc(req.OldSectionID), []firestore.Update{
		{Path: "swappedOutStudents." + req.AssignmentID, Value: firestore.ArrayUnion(req.StudentID)},
	})

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSectionsCollection).Doc(req.NewSectionID), []firestore.Update{
		{Path: "swappedOutStudents." + req.AssignmentID, Value: firestore.ArrayRemove(req.StudentID)},
	})

	// get the course.students object from the course document
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, err
	}

	defaultSection := course.Students[req.StudentID].DefaultSection
	if req.NewSectionID == defaultSection {
		// default section
		batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.StudentID),
			[]firestore.Update{
				{Path: "actualSections." + req.CourseID + "." + req.AssignmentID, Value: firestore.Delete},
			})
	} else {
		// non-default
		batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
			models.FirestoreSectionsCollection).Doc(req.NewSectionID), []firestore.Update{
			{Path: "swappedInStudents." + req.AssignmentID, Value: firestore.ArrayUnion(req.StudentID)},
		})
		batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.StudentID),
			[]firestore.Update{
				{Path: "actualSections." + req.CourseID + "." + req.AssignmentID, Value: req.NewSectionID},
			})
	}

	return batch, nil
}

func (fr *FirebaseRepository) BulkUpload(req *models.BulkUploadRequest) error {
	for _, r := range req.Requests {
		// Create the course
		course, err := fr.CreateCourse(&models.CreateCourseRequest{
			Title: r.Title,
			Code:  r.Code,
			Term:  r.Term,
		})

		if err != nil {
			return err
		}

		// Add permissions

		for _, perm := range r.Permissions {
			_, err = fr.AddPermissions(&models.AddPermissionRequest{
				CourseID:   course.ID,
				Email:      perm.Email,
				Permission: perm.Permission,
			})
			if err != nil {
				return err
			}
		}
	}
	return nil
}
