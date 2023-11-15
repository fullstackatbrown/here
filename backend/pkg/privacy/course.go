package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessCourse(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := make(map[string]interface{})

	data["title"] = dbObj["title"]

	return data
}
