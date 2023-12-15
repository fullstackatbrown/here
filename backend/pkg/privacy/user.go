package privacy

import (
	"fmt"

	"github.com/fullstackatbrown/here/pkg/models"
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func handleAccessUser(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (data map[string]interface{}, err error) {
	data = map[string]interface{}{
		"name":          dbObj["displayName"],
		"email":         dbObj["email"],
		"photoUrl":      dbObj["photoUrl"],
		"isAdmin":       dbObj["isAdmin"],
		"notifications": dbObj["notifications"],
	}

	slice, ok := dbObj["courses"].([]interface{})
	if !ok {
		err = cannotCastFieldToType("courses", "[]interface{}")
		return
	}
	courses := make([]string, len(slice))
	for i, v := range slice {
		course, ok := v.(string)
		if !ok {
			err = cannotCastFieldToType(fmt.Sprintf("courses element %v", v), "string")
			return
		}
		courses[i] = course
	}

	courseMap := make(map[string]pal.Locator)
	for _, courseID := range courses {
		courseMap[courseID] = pal.Locator{
			LocatorType: pal.Document,
			DataType:    CourseDataType,
			FirestoreLocator: pal.FirestoreLocator{
				CollectionPath: []string{models.FirestoreCoursesCollection},
				DocIDs:         []string{courseID},
			},
		}
	}
	data["courses"] = courseMap

	sections, ok := dbObj["defaultSections"].(map[string]interface{})
	if !ok {
		err = cannotCastFieldToType("defaultSections", "map[string]interface{}")
		return
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

	return
}

func handleDeleteUser(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (nodesToTraverse []pal.Locator, deleteNode bool, fieldsToUpdate pal.FieldUpdates, err error) {
	deleteNode = true

	// add courses to nodesToTraverse
	slice, ok := dbObj["courses"].([]interface{})
	if !ok {
		err = cannotCastFieldToType("courses", "[]interface{}")
		return
	}
	courses := make([]string, len(slice))
	for i, v := range slice {
		course, ok := v.(string)
		if !ok {
			err = cannotCastFieldToType(fmt.Sprintf("courses element %v", v), "string")
			return
		}
		courses[i] = course
	}
	for _, courseID := range courses {
		nodesToTraverse = append(nodesToTraverse, pal.Locator{
			LocatorType: pal.Document,
			DataType:    CourseDataType,
			FirestoreLocator: pal.FirestoreLocator{
				CollectionPath: []string{models.FirestoreCoursesCollection},
				DocIDs:         []string{courseID},
			},
		})
	}

	// add defaultSections to nodesToTraverse
	sections, ok := dbObj["defaultSections"].(map[string]interface{})
	if !ok {
		err = cannotCastFieldToType("defaultSections", "map[string]interface{}")
		return
	}
	for courseID, sectionID := range sections {
		nodesToTraverse = append(nodesToTraverse, pal.Locator{
			LocatorType: pal.Document,
			DataType:    SectionDataType,
			FirestoreLocator: pal.FirestoreLocator{
				CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreSectionsCollection},
				DocIDs:         []string{courseID, sectionID.(string)},
			},
		})
	}

	// add actualSections to nodesToTraverse
	actualSections, ok := dbObj["actualSections"].(map[string]interface{})
	if !ok {
		err = cannotCastFieldToType("actualSections", "map[string]interface{}")
		return
	}
	for courseID, sectionsMap := range actualSections {
		sections, ok := sectionsMap.(map[string]interface{})
		if !ok {
			err = cannotCastFieldToType(fmt.Sprintf("actualSections entry %v", sectionsMap), "map[string]interface{}")
			return
		}
		for _, sectionID := range sections {
			id, ok := sectionID.(string)
			if !ok {
				err = cannotCastFieldToType(fmt.Sprintf("actualSections nested entry %v", sectionID), "string")
				return
			}
			nodesToTraverse = append(nodesToTraverse, pal.Locator{
				LocatorType: pal.Document,
				DataType:    SectionDataType,
				FirestoreLocator: pal.FirestoreLocator{
					CollectionPath: []string{models.FirestoreCoursesCollection, models.FirestoreSectionsCollection},
					DocIDs:         []string{courseID, id},
				},
			})
		}
	}

	return
}
