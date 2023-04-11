package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func AssignmentRoutes() *chi.Mux {
	router := chi.NewRouter()
	// router.Use(middleware.AuthCtx())

	router.Post("/", createAssignmentHandler)
	router.Route("/{assignmentID}", func(router chi.Router) {
		router.Get("/", getAssignmentHandler)
		router.Delete("/", deleteAssignmentHandler)
		router.Patch("/", updateAssignmentHandler)
		router.Mount("/grades", GradesRoutes())
	})

	return router
}

func getAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	assignmentID := chi.URLParam(r, "assignmentID")

	assignment, err := repo.Repository.GetAssignmentByID(courseID, assignmentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, assignment)
}

func createAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	var req *models.CreateAssignmentRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID

	c, err := repo.Repository.CreateAssignment(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, c)
}

func updateAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	assignmentID := chi.URLParam(r, "assignmentID")
	var req *models.UpdateAssignmentRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = &courseID
	req.AssignmentID = &assignmentID

	err = repo.Repository.UpdateAssignment(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated assignment " + assignmentID))
}

func deleteAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	assignmentID := chi.URLParam(r, "assignmentID")

	err := repo.Repository.DeleteAssignment(&models.DeleteAssignmentRequest{CourseID: courseID, AssignmentID: assignmentID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted assignment " + assignmentID))

}
