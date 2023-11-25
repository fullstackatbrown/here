package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessAssignment(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := map[string]interface{}{
		"name":        dbObj["name"],
		"optional":    dbObj["optional"],
		"maxScore":    dbObj["maxScore"],
		"releaseDate": dbObj["releaseDate"],
		"dueDate":     dbObj["dueDate"],
		"grade":       dbObj["grades"].(map[string]interface{})[dataSubjectId],
	}

	return data
}
