package router

import (
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/go-chi/chi/v5"
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
	// courseID := r.Context().Value("sectionID").(string)

	// TODO:

	// render.JSON(w, r, course)
}

func getAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("sectionID").(string)

	// TODO:

	// render.JSON(w, r, course)
}

func createAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("courseID").(string)
	// var req *models.CreateAssignmentRequest

	// err := json.NewDecoder(r.Body).Decode(&req)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// TODO:
	// render.JSON(w, r, c)
}

func updateAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("courseID").(string)
	// var req *models.UpdateSectionRequest

	// err := json.NewDecoder(r.Body).Decode(&req)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// TODO:
}

func deleteAssignmentHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("courseID").(string)

	// TODO:

}
