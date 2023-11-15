package privacy

import (
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
)

const (
	UserDataType    = "user"
	CourseDataType  = "course"
	SectionDataType = "section"
)

func HandleAccess(dataSubjectId string, currentDbObjLocator pal.Locator, dbObj pal.DatabaseObject) map[string]interface{} {
	switch currentDbObjLocator.DataType {
	case UserDataType:
		return accessUser(dataSubjectId, currentDbObjLocator, dbObj)
	case CourseDataType:
		return accessCourse(dataSubjectId, currentDbObjLocator, dbObj)
	case SectionDataType:
		return accessSection(dataSubjectId, currentDbObjLocator, dbObj)
	default:
		// TODO: should return error
		return nil
	}
}
