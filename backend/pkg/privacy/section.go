package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessSection(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := make(map[string]interface{})

	data["start time"] = dbObj["startTime"]
	data["end time"] = dbObj["endTime"]
	data["location"] = dbObj["location"]

	return data
}
