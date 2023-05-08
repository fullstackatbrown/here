package router

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
)

func PermissionRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.With(middleware.RequireCourseOrSiteAdmin()).Patch("/add", addPermissionsHandler)
	router.With(middleware.RequireCourseOrSiteAdmin()).Patch("/revoke", revokePermissionHandler)

	router.With(middleware.RequireCourseAdmin()).Patch("/addStudent", addStudentHandler)
	router.With(middleware.RequireCourseAdmin()).Patch("/deleteStudent", deleteStudentHandler)
	router.With(middleware.RequireCourseAdmin()).Patch("/bulkAddStudent", bulkAddStudentHandler)

	return router
}

func addPermissionsHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.AddPermissionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.CourseID = chi.URLParam(r, "courseID")

	exists, badReq, err := repo.Repository.AddPermissions(req)
	if badReq != nil {
		http.Error(w, badReq.Error(), http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	if exists {
		w.Write([]byte("Permission already exists"))
	} else {
		w.Write([]byte("Added permission!"))
	}
}

func revokePermissionHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.DeletePermissionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.CourseID = chi.URLParam(r, "courseID")

	err = repo.Repository.DeletePermission(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Successfully deleted course permission for " + req.CourseID))
}

func addStudentHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.AddStudentRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.CourseID = chi.URLParam(r, "courseID")

	errors := make(map[string]string)
	exists, badReq, err := repo.Repository.AddStudentToCourse(req)
	if badReq != nil {
		errors[req.Email] = badReq.Error()
	}
	if err != nil {
		errors[req.Email] = "unknown error"
	}
	if exists {
		errors[req.Email] = "student is already enrolled in course"
	}

	response := map[string]interface{}{
		"errors": errors,
	}
	if len(errors) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Added student %v!", req.Email)))
}

func deleteStudentHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.DeleteStudentRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.CourseID = chi.URLParam(r, "courseID")

	err = repo.Repository.DeleteStudentFromCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Successfully deleted student %v from course %v", req.UserID, req.CourseID)))

}

func bulkAddStudentHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.BulkAddStudentRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.CourseID = chi.URLParam(r, "courseID")

	success := make([]string, 0)
	errors := make(map[string]string)

	for _, email := range req.Emails {
		_, badReq, err := repo.Repository.AddStudentToCourse(&models.AddStudentRequest{
			CourseID: req.CourseID,
			Email:    email,
		})
		if badReq != nil {
			errors[email] = badReq.Error()
			continue
		}

		if err != nil {
			errors[email] = "unknown error"
			continue
		}
		success = append(success, email)
	}

	response := map[string]interface{}{
		"success": success,
		"errors":  errors,
	}

	if len(errors) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Successfully added students"))
}
