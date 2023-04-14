package router

import (
	"encoding/json"
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

	err = repo.Repository.AddPermissions(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
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

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted course permission for " + req.CourseID))
}
