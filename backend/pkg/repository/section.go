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
)

// CoursesLock should be locked on entry
func (fr *FirebaseRepository) initializeSectionsListener(course *models.Course) error {

	handleDocs := func(docs []*firestore.DocumentSnapshot) error {
		newSections := make(map[string]*models.Section)
		for _, doc := range docs {
			if !doc.Exists() {
				continue
			}

			var c models.Section
			err := mapstructure.Decode(doc.Data(), &c)
			if err != nil {
				log.Panicf("Error destructuring document: %v", err)
				return err
			}

			c.ID = doc.Ref.ID
			newSections[doc.Ref.ID] = &c
		}

		course.SectionsLock.Lock()
		defer course.SectionsLock.Unlock()

		course.Sections = newSections

		return nil
	}

	done := make(chan func())
	query := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(
		course.ID).Collection(models.FirestoreSectionsCollection).Query
	go func() {
		err := fr.createCollectionInitializer(query, &done, handleDocs)
		if err != nil {
			log.Panicf("error creating section collection listener: %v\n", err)
		}
	}()
	cancelFunc := <-done
	course.SectionsListenerCancelFunc = cancelFunc
	return nil
}

// GetCourseByID gets the Course from the courses map corresponding to the provided course ID.
func (fr *FirebaseRepository) GetSectionByID(courseID string, sectionID string) (*models.Section, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	course.SectionsLock.RLock()
	defer course.SectionsLock.RUnlock()

	section, ok := course.Sections[sectionID]
	if !ok {
		return nil, qerrors.SectionNotFoundError
	}

	return section, nil
}

// Returns a map from a unique time, to a map from section id (that has the time) to capacity
func (fr *FirebaseRepository) GetUniqueSectionTimes(courseID string) (map[string]map[string]int, error) {
	course, err := fr.GetCourseByID(courseID)
	if err != nil {
		return nil, err
	}

	capacity := make(map[string]map[string]int)

	course.SectionsLock.RLock()
	defer course.SectionsLock.RUnlock()

	for _, section := range course.Sections {
		t := fmt.Sprintf("%s,%s,%s", section.Day, section.StartTime, section.EndTime)

		_, ok := capacity[t]
		if !ok {
			capacity[t] = make(map[string]int)
		}
		_, ok = capacity[t][section.ID]
		if !ok {
			capacity[t][section.ID] = 0
		}
		capacity[t][section.ID] += section.Capacity
	}

	return capacity, nil
}

func (fr *FirebaseRepository) GetSectionByInfo(course *models.Course, startTime string, endTime string, location string) (*models.Section, error) {
	locationCollapsed := utils.CollapseString(location)

	course.SectionsLock.RLock()
	defer course.SectionsLock.RUnlock()

	for _, section := range course.Sections {
		if section.StartTime == startTime && section.EndTime == endTime && utils.CollapseString(section.Location) == locationCollapsed {
			return section, nil
		}
	}

	return nil, nil
}

func (fr *FirebaseRepository) CreateSection(req *models.CreateSectionRequest) (section *models.Section, err error) {

	section = &models.Section{
		Day:                models.Day(req.Day),
		CourseID:           req.Course.ID,
		StartTime:          req.StartTime,
		EndTime:            req.EndTime,
		Location:           req.Location,
		Capacity:           req.Capacity,
		NumEnrolled:        0,
		SwappedInStudents:  make(map[string][]string),
		SwappedOutStudents: make(map[string][]string),
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.Course.ID).Collection(
		models.FirestoreSectionsCollection).Add(firebase.Context, section)
	if err != nil {
		return nil, fmt.Errorf("error creating assignment: %v\n", err)
	}

	section.ID = ref.ID

	return section, nil
}

func (fr *FirebaseRepository) DeleteSection(req *models.DeleteSectionRequest) error {
	section, err := fr.GetSectionByID(req.Course.ID, req.SectionID)
	if err != nil {
		return err
	}

	// Remove all students currently enrolled in the section
	if section.NumEnrolled > 0 {
		fr.coursesLock.RLock()
		for _, student := range req.Course.Students {
			if student.DefaultSection == req.SectionID {
				err := fr.AssignStudentToSection(&models.AssignSectionsRequest{
					Course:       req.Course,
					StudentID:    student.StudentID,
					OldSectionID: req.SectionID,
				})
				if err != nil {
					glog.Warningf("Error removing student %s from section %s: %v", student.StudentID, req.SectionID, err)
				}

				// Notify student
				err = fr.AddNotification(student.StudentID, req.Course.Code, models.NotificationSectionDeleted)
				if err != nil {
					glog.Warningf("Error notifying student %s", student.StudentID, err)
				}
			}
		}
		fr.coursesLock.RUnlock()
	}

	// Delete the section
	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.Course.ID).Collection(
		models.FirestoreSectionsCollection).Doc(req.SectionID).Delete(firebase.Context)

	return err
}

func (fr *FirebaseRepository) UpdateSection(req *models.UpdateSectionRequest) error {

	v := reflect.ValueOf(*req)
	typeOfS := v.Type()

	var updates []firestore.Update

	for i := 0; i < v.NumField(); i++ {
		field := typeOfS.Field(i).Name
		val := v.Field(i).Interface()

		// Only include the fields that are set
		if (field != "Course") && (field != "SectionID") && (field != "NotifyStudent") && (!reflect.ValueOf(val).IsNil()) {
			updates = append(updates, firestore.Update{Path: utils.LowercaseFirst(field), Value: val})
		}
	}

	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(req.Course.ID).Collection(
		models.FirestoreSectionsCollection).Doc(*req.SectionID).Update(firebase.Context, updates)
	if err != nil {
		return err
	}

	// notify all students currently enrolled
	if req.NotifyStudent {
		fr.coursesLock.RLock()
		for _, student := range req.Course.Students {
			if student.DefaultSection == *req.SectionID {
				err := fr.AddNotification(student.StudentID, req.Course.Code, models.NotificationSectionUpdated)
				if err != nil {
					glog.Warningf("Error notifying student %s", student.StudentID, err)
				}
			}
		}
		fr.coursesLock.RUnlock()
	}

	return nil
}
