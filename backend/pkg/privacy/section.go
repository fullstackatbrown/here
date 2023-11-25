package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessSection(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := map[string]interface{}{
		"startTime": dbObj["startTime"],
		"endTime":   dbObj["endTime"],
		"location":  dbObj["location"],
	}

	return data
}
