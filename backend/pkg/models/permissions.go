package models

type AddPermissionRequest struct {
	CourseID   string           `json:"courseID,omitempty"`
	Email      string           `json:"email"`
	Permission CoursePermission `json:"permission"`
}

type DeletePermissionRequest struct {
	CourseID string `json:"courseID"`
	UserID   string `json:"userID,omitempty"`
	Email    string `json:"email,omitempty"`
}

type CreateCourseAndPermissionsRequest struct {
	Title       string                  `json:"title"`
	Code        string                  `json:"code"`
	Term        string                  `json:"term"`
	Permissions []*AddPermissionRequest `json:"permissions"`
}

type BulkUploadRequest struct {
	Requests []CreateCourseAndPermissionsRequest `json:"requests"`
}

type AddStudentRequest struct {
	CourseID string `json:"courseID,omitempty"`
	Email    string `json:"email"`
}

type BulkAddStudentRequest struct {
	CourseID string   `json:"courseID,omitempty"`
	Emails   []string `json:"emails"`
}

type DeleteStudentRequest struct {
	Course *Course `json:"course,omitempty"`
	UserID string  `json:"userID,omitempty"`
	Email  string  `json:"email,omitempty"`
}
