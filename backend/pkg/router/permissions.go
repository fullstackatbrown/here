package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
)

func PermissionRoutes() *chi.Mux {
	router := chi.NewRouter()

	// router.With(auth.RequireCourseAdmin()).Post("/", createPermissionsHandler)

	router.Post("/", createPermissionsHandler)
	router.Delete("/", deletePermissionHandler)
	return router
}

func createPermissionsHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.CreatePermissionsRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.CourseID = chi.URLParam(r, "courseID")

	err = repo.Repository.CreatePermissions(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully added course permission to " + req.CourseID))
}

func deletePermissionHandler(w http.ResponseWriter, r *http.Request) {

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

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted course permission for " + req.CourseID))
}
