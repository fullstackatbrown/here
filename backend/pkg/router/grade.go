package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func GradesRoutes() *chi.Mux {
	router := chi.NewRouter()
	// router.Use(middleware.AuthCtx())

	router.Post("/", createGradeHandler)
	router.Post("/export", exportGradesHandler)
	router.Route("/{gradeID}", func(router chi.Router) {
		router.Patch("/", updateGradeHandler)
		router.Delete("/", deleteGradeHandler)
	})

	return router
}

func createGradeHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	assignmentID := chi.URLParam(r, "assignmentID")

	var req *models.CreateGradeRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID
	req.AssignmentID = assignmentID

	c, err := repo.Repository.CreateGrade(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, c)
}

func updateGradeHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	assignmentID := chi.URLParam(r, "assignmentID")
	gradeID := chi.URLParam(r, "gradeID")

	var req *models.UpdateGradeRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID
	req.AssignmentID = assignmentID
	req.GradeID = gradeID

	err = repo.Repository.UpdateGrade(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated grade " + gradeID))
}

func deleteGradeHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	assignmentID := chi.URLParam(r, "assignmentID")
	gradeID := chi.URLParam(r, "gradeID")

	req := &models.DeleteGradeRequest{
		CourseID:     courseID,
		AssignmentID: assignmentID,
		GradeID:      gradeID,
	}

	err := repo.Repository.DeleteGrade(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted grade " + gradeID))

}

func exportGradesHandler(w http.ResponseWriter, r *http.Request) {
}
