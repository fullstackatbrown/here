package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessSwap(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := map[string]interface{}{
		"oldSectionID": dbObj["oldSectionID"],
		"newSectionID": dbObj["newSectionID"],
		"assignmentID": dbObj["assignmentID"],
		"requestTime":  dbObj["requestTime"],
		"handledTime":  dbObj["handledTime"],
		"reason":       dbObj["reason"],
		"status":       dbObj["status"],
		"handledBy":    dbObj["handledBy"],
	}

	return data
}

func deleteSwap(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (nodesToTraverse []pal.Locator, deleteNode bool, fieldsToUpdate pal.FieldUpdates, err error) {
	deleteNode = true
	return
}
