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
	"github.com/mitchellh/mapstructure"
)

func (fr *FirebaseRepository) initializeCoursesListener() {
	firstTime := true
	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newCourses := make(map[string]*models.Course)
		newCoursesEntryCodes := make(map[string]string)
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
			// TODO: do not add to map if term is over
			newCoursesEntryCodes[c.EntryCode] = doc.Ref.ID
		}

		fr.coursesLock.Lock()
		fr.coursesEntryCodesLock.Lock()

		fr.courses = newCourses
		fr.coursesEntryCodes = newCoursesEntryCodes

		fr.coursesEntryCodesLock.Unlock()
		fr.coursesLock.Unlock()

		if firstTime {
			for courseID := range fr.courses {
				fr.initializeSectionsListener(courseID)
				fr.initializeAssignmentsListener(courseID)
			}
			firstTime = false
		}

		return nil
	}

	done := make(chan bool)
	query := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating course collection listener: %v\n", err)
		}
	}()
	<-done
}

// GetCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetCourseByID(ID string) (*models.Course, error) {
	fr.coursesLock.RLock()
	defer fr.coursesLock.RUnlock()

	if val, ok := fr.courses[ID]; ok {
		return val, nil
	} else {
		return nil, qerrors.CourseNotFoundError
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

func (fr *FirebaseRepository) GetCourseByEntryCode(entryCode string) (*models.Course, error) {
	fr.coursesEntryCodesLock.RLock()
	defer fr.coursesEntryCodesLock.RUnlock()

	if val, ok := fr.coursesEntryCodes[entryCode]; ok {
		return fr.GetCourseByID(val)
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

	courseID := models.CreateCourseID(req)

	// Check if an assignment with the same name already exists
	c, err := fr.GetCourseByID(courseID)
	if err == nil && c != nil {
		return nil, qerrors.CourseAlreadyExistsError
	}

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
		AutoApproveRequests: req.AutoApproveRequests,
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Add(firebase.Context, course)
	if err != nil {
		return nil, fmt.Errorf("error creating course: %v\n", err)
	}
	course.ID = ref.ID

	return course, nil
}

func (fr *FirebaseRepository) DeleteCourse(req *models.DeleteCourseRequest) error {
	_, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return err
	}
	// Delete the course.
	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Delete(firebase.Context)
	return err
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

func (fr *FirebaseRepository) AssignStudentToSection(req *models.AssignSectionsRequest) error {
	batch, err := fr.assignPermanentSection(req)
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
	course, err := fr.GetCourseByID(req.CourseID)
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

func (fr *FirebaseRepository) assignTemporarySection(req *models.AssignSectionsRequest) (*firestore.WriteBatch, error) {
	// In a batch
	// 1. Update the swappedOutStudents map of the old section
	// 2. Update the swappedInStudents map of the new section
	// 3. Update the students's actualSections map
	//    If the student is moving into its default section, remove the entry from actual sections
	//    otherwise, update the student's actual section
	batch := fr.firestoreClient.Batch()

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSectionsCollection).Doc(req.NewSectionID), []firestore.Update{
		{Path: "swappedInStudents." + req.AssignmentID, Value: firestore.ArrayUnion(req.StudentID)},
	})

	batch.Update(fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.CourseID).Collection(
		models.FirestoreSectionsCollection).Doc(req.OldSectionID), []firestore.Update{
		{Path: "swappedOutStudents." + req.AssignmentID, Value: firestore.ArrayUnion(req.StudentID)},
	})

	// get the course.students object from the course document
	course, err := fr.GetCourseByID(req.CourseID)
	if err != nil {
		return nil, err
	}

	defaultSection := course.Students[req.StudentID].DefaultSection
	if req.NewSectionID == defaultSection {
		batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.StudentID),
			[]firestore.Update{
				{Path: "actualSections." + req.CourseID + "." + req.AssignmentID, Value: firestore.Delete},
			})
	} else {
		batch.Update(fr.firestoreClient.Collection(models.FirestoreProfilesCollection).Doc(req.StudentID),
			[]firestore.Update{
				{Path: "actualSections." + req.CourseID + "." + req.AssignmentID, Value: req.NewSectionID},
			})
	}

	return batch, nil
}
