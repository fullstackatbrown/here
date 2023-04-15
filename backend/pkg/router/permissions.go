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

	hadPermission, err := repo.Repository.AddPermissions(req)
	if hadPermission {
		http.Error(w, fmt.Sprintf("Already have %s access", req.Permission), http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Successfully added course permission to " + req.CourseID))
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

	studentExists, studentIsStaff, err := repo.Repository.AddStudentToCourse(req)
	if studentExists {
		http.Error(w, req.Email+"is already enrolled in the course", http.StatusBadRequest)
		return
	}

	if studentIsStaff {
		http.Error(w, req.Email+" is already a staff member of this course", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Successfully added student %v from course %v", req.Email, req.CourseID)))
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
