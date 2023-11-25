package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessSurvey(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := map[string]interface{}{
		"name":        dbObj["name"],
		"description": dbObj["description"],
		"endTime":     dbObj["endTime"],
		"options":     dbObj["options"],
		"responses":   dbObj["responses"].(map[string]interface{})[dataSubjectId],
	}

	return data
}
