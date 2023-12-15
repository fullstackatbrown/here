package privacy

import (
	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/models"
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func handleAccessCourse(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (data map[string]interface{}, err error) {
	data = map[string]interface{}{
		"title": dbObj["title"],
	}

	data["assignments"] = pal.Locator{
		LocatorType: pal.Collection,
		DataType:    AssignmentDataType,
		FirestoreLocator: pal.FirestoreLocator{
			CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreAssignmentsCollection},
			DocIDs:         []string{currentDbObjLocator.FirestoreLocator.DocIDs[0]},
		},
	}

	data["surveys"] = pal.Locator{
		LocatorType: pal.Collection,
		DataType:    SurveyDataType,
		FirestoreLocator: pal.FirestoreLocator{
			CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreSurveysCollection},
			DocIDs:         []string{currentDbObjLocator.FirestoreLocator.DocIDs[0]},
		},
	}

	data["swaps"] = pal.Locator{
		LocatorType: pal.Collection,
		DataType:    SwapDataType,
		FirestoreLocator: pal.FirestoreLocator{
			CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreSwapsCollection},
			DocIDs:         []string{currentDbObjLocator.FirestoreLocator.DocIDs[0]},
			// Query for swaps where studentID is the dataSubjectID
			Filters: []pal.Filter{
				{
					Path:  "studentID",
					Op:    "==",
					Value: dataSubjectId,
				},
			},
		},
	}

	return
}

func handleDeleteCourse(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (nodesToTraverse []pal.Locator, deleteNode bool, fieldsToUpdate pal.FieldUpdates, err error) {
	deleteNode = false

	updates := []firestore.Update{}
	// remove student associated with dataSubjectId from the students field
	updates = append(updates, firestore.Update{
		Path:  "students." + dataSubjectId,
		Value: firestore.Delete,
	})
	// remove permission associated with dataSubjectId from the permissions field
	updates = append(updates, firestore.Update{
		Path:  "permissions." + dataSubjectId,
		Value: firestore.Delete,
	})

	// add swaps and surveys to nodesToTraverse
	nodesToTraverse = append(nodesToTraverse, pal.Locator{
		LocatorType: pal.Collection,
		DataType:    SwapDataType,
		FirestoreLocator: pal.FirestoreLocator{
			CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreSwapsCollection},
			DocIDs:         []string{currentDbObjLocator.FirestoreLocator.DocIDs[0]},
			Filters: []pal.Filter{
				{
					Path:  "studentID",
					Op:    "==",
					Value: dataSubjectId,
				},
			},
		},
	})
	nodesToTraverse = append(nodesToTraverse, pal.Locator{
		LocatorType: pal.Collection,
		DataType:    SurveyDataType,
		FirestoreLocator: pal.FirestoreLocator{
			CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreSurveysCollection},
			DocIDs:         []string{currentDbObjLocator.FirestoreLocator.DocIDs[0]},
		},
	})

	fieldsToUpdate = pal.FieldUpdates{
		FirestoreUpdates: updates,
	}
	return
}
