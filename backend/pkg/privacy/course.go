package privacy

import (
	"github.com/fullstackatbrown/here/pkg/models"
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

func accessCourse(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	data := map[string]interface{}{
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

	return data
}
