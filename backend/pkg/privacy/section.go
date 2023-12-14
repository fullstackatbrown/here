package privacy

import (
	"fmt"

	"cloud.google.com/go/firestore"
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func handleAccessSection(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := map[string]interface{}{
		"startTime": dbObj["startTime"],
		"endTime":   dbObj["endTime"],
		"location":  dbObj["location"],
	}

	return data
}

func handleDeleteSection(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (nodesToTraverse []pal.Locator, deleteNode bool, fieldsToUpdate pal.FieldUpdates, err error) {
	deleteNode = false

	// decrement numEnrolled in course
	updates := []firestore.Update{
		{
			Path:  "numEnrolled",
			Value: firestore.Increment(-1),
		},
	}

	// remove dataSubjectId from swappedInStudents if exists
	swappedInStudents, ok := dbObj["swappedInStudents"].(map[string]interface{})
	if !ok {
		err = fmt.Errorf("swappedInStudents is not a map[string]interface{}")
		return
	}
	for _, studentIDs := range swappedInStudents {
		studentIDsSlice, ok := studentIDs.([]interface{})
		if !ok {
			err = fmt.Errorf("studentIDs is not a []interface{}")
			return
		}
		for _, studentID := range studentIDsSlice {
			id, ok := studentID.(string)
			if !ok {
				err = fmt.Errorf("studentID is not a string")
				return
			}
			if id == dataSubjectId {
				updates = append(updates, firestore.Update{
					Path:  "swappedInStudents." + dataSubjectId,
					Value: firestore.Delete,
				})
			}
		}
	}

	// remove dataSubjectId from swappedOutStudents if exists
	swappedOutStudents, ok := dbObj["swappedOutStudents"].(map[string]interface{})
	if !ok {
		err = fmt.Errorf("swappedOutStudents is not a map[string]interface{}")
		return
	}
	for _, studentIDs := range swappedOutStudents {
		studentIDsSlice, ok := studentIDs.([]interface{})
		if !ok {
			err = fmt.Errorf("studentIDs is not a []interface{}")
			return
		}
		for _, studentID := range studentIDsSlice {
			id, ok := studentID.(string)
			if !ok {
				err = fmt.Errorf("studentID is not a string")
				return
			}
			if id == dataSubjectId {
				updates = append(updates, firestore.Update{
					Path:  "swappedOutStudents." + dataSubjectId,
					Value: firestore.Delete,
				})
			}
		}
	}

	fieldsToUpdate = pal.FieldUpdates{
		FirestoreUpdates: updates,
	}

	return
}
