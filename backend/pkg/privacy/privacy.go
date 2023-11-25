package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

const (
	UserDataType       = "user"
	CourseDataType     = "course"
	SectionDataType    = "section"
	AssignmentDataType = "assignment"
	SurveyDataType     = "survey"
	SwapDataType       = "swap"
)

func HandleAccess(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	switch currentDbObjLocator.DataType {
	case UserDataType:
		return accessUser(dataSubjectId, currentDbObjLocator, dbObj)
	case CourseDataType:
		return accessCourse(dataSubjectId, currentDbObjLocator, dbObj)
	case SectionDataType:
		return accessSection(dataSubjectId, currentDbObjLocator, dbObj)
	case AssignmentDataType:
		return accessAssignment(dataSubjectId, currentDbObjLocator, dbObj)
	case SurveyDataType:
		return accessSurvey(dataSubjectId, currentDbObjLocator, dbObj)
	case SwapDataType:
		return accessSwap(dataSubjectId, currentDbObjLocator, dbObj)
	default:
		// TODO: should return error
		return nil
	}
}
