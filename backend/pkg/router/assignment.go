package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func AssignmentRoutes() *chi.Mux {
	router := chi.NewRouter()
	// router.Use(middleware.AuthCtx())

	router.Post("/", createAssignmentHandler)
	router.Get("/", getAllAssignmentsHandler)
	router.Route("/{assignmentID}", func(router chi.Router) {
		router.Use(middleware.AssignmentCtx())
		router.Get("/", getAssignmentHandler)
		router.Delete("/", deleteAssignmentHandler)
		router.Patch("/", updateAssignmentHandler)
	})

	return router
}

func getAllAssignmentsHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)

	assignments, err := repo.Repository.GetAssignmentByCourse(courseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, assignments)
}

func getAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	assignmentID := r.Context().Value("assignmentID").(string)

	assignment, err := repo.Repository.GetAssignmentByID(assignmentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, assignment)
}

func createAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
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
	courseID := r.Context().Value("courseID").(string)
	assignmentID := r.Context().Value("assignmentID").(string)
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
	courseID := r.Context().Value("courseID").(string)
	assignmentID := r.Context().Value("assignmentID").(string)

	err := repo.Repository.DeleteAssignment(&models.DeleteAssignmentRequest{CourseID: courseID, AssignmentID: assignmentID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted assignment " + assignmentID))

}
