package privacy

import (
	"fmt"

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

func HandleAccess(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (data map[string]interface{}, err error) {
	switch currentDbObjLocator.DataType {
	case UserDataType:
		return handleAccessUser(dataSubjectId, currentDbObjLocator, dbObj)
	case CourseDataType:
		return handleAccessCourse(dataSubjectId, currentDbObjLocator, dbObj)
	case SectionDataType:
		return handleAccessSection(dataSubjectId, currentDbObjLocator, dbObj)
	case AssignmentDataType:
		return handleAccessAssignment(dataSubjectId, currentDbObjLocator, dbObj)
	case SurveyDataType:
		return handleAccessSurvey(dataSubjectId, currentDbObjLocator, dbObj)
	case SwapDataType:
		return handleAccessSwap(dataSubjectId, currentDbObjLocator, dbObj)
	default:
		err = fmt.Errorf("invalid data type")
		return
	}
}

func HandleDelete(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) (nodesToTraverse []pal.Locator, deleteNode bool, fieldsToUpdate pal.FieldUpdates, err error) {
	switch currentDbObjLocator.DataType {
	case UserDataType:
		return handleDeleteUser(dataSubjectId, currentDbObjLocator, dbObj)
	case CourseDataType:
		return handleDeleteCourse(dataSubjectId, currentDbObjLocator, dbObj)
	case SectionDataType:
		return handleDeleteSection(dataSubjectId, currentDbObjLocator, dbObj)
	case AssignmentDataType:
		return handleDeleteAssignment(dataSubjectId, currentDbObjLocator, dbObj)
	case SurveyDataType:
		return handleDeleteSurvey(dataSubjectId, currentDbObjLocator, dbObj)
	case SwapDataType:
		return handleDeleteSwap(dataSubjectId, currentDbObjLocator, dbObj)
	default:
		return
	}
}
