package privacy

import (
	"github.com/fullstackatbrown/here/pkg/models"
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessUser(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := make(map[string]interface{})

	data["name"] = dbObj["displayName"]
	data["email"] = dbObj["email"]
	data["photoUrl"] = dbObj["photoUrl"]

	slice, ok := dbObj["courses"].([]interface{})
	if !ok {
		return data
	}
	courses := make([]string, len(slice))
	if !ok {
		return data
	}
	for i, v := range slice {
		course, ok := v.(string)
		if !ok {
			return data
		}
		courses[i] = course
	}

	data["courses"] = []pal.Locator{}
	for _, courseID := range courses {
		data["courses"] = append(data["courses"].([]pal.Locator), pal.Locator{
			LocatorType: pal.Document,
			DataType:    CourseDataType,
			FirestoreLocator: pal.FirestoreLocator{
				CollectionPath: []string{models.FirestoreCoursesCollection},
				DocIDs:         []string{courseID},
			},
		})
	}

	sections, ok := dbObj["defaultSections"].(map[string]interface{})
	if !ok {
		return data
	}
	data["defaultSections"] = []pal.Locator{}
	for courseID, sectionID := range sections {
		data["defaultSections"] = append(data["defaultSections"].([]pal.Locator), pal.Locator{
			LocatorType: pal.Document,
			DataType:    SectionDataType,
			FirestoreLocator: pal.FirestoreLocator{
				CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreSectionsCollection},
				DocIDs:         []string{courseID, sectionID.(string)},
			},
		})
	}

	return data
}
