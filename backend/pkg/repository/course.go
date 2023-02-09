package database

import (
	"fmt"

	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
)

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

func (fr *FirebaseRepository) CreateCourse(c *models.CreateCourseRequest) (course *models.Course, err error) {
	course = &models.Course{
		Title: c.Title,
		Code:  c.Code,
		Term:  c.Term,
	}

	ref, _, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Add(firebase.Context, map[string]interface{}{
		"title": course.Title,
		"code":  course.Code,
		"term":  course.Term,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating course: %v\n", err)
	}
	course.ID = ref.ID

	return course, nil
}

// func (fr *FirebaseRepository) DeleteCourse(c *models.DeleteCourseRequest) error {
// 	// Get this course's info.
// 	course, err := fr.GetCourseByID(c.CourseID)
// 	if err != nil {
// 		return err
// 	}

// 	// Delete this course from all users with permissions.
// 	for k := range course.CoursePermissions {
// 		_, err = fr.firestoreClient.Collection(models.FirestoreUserProfilesCollection).Doc(k).Update(firebase.Context, []firestore.Update{
// 			{
// 				Path:  "coursePermissions." + course.ID,
// 				Value: firestore.Delete,
// 			},
// 		})
// 		if err != nil {
// 			return err
// 		}
// 	}

// 	// Delete the course.
// 	_, err = fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(c.CourseID).Delete(firebase.Context)
// 	return err
// }

// func (fr *FirebaseRepository) EditCourse(c *models.EditCourseRequest) error {
// 	_, err := fr.firestoreClient.Collection(models.FirestoreCoursesCollection).Doc(c.CourseID).Update(firebase.Context, []firestore.Update{
// 		{Path: "title", Value: c.Title},
// 		{Path: "term", Value: c.Term},
// 		{Path: "code", Value: c.Code},
// 	})
// 	return err
// }
