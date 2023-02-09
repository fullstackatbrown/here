package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func SectionRoutes() *chi.Mux {
	router := chi.NewRouter()
	// All course routes require authentication.
	// router.Use(middleware.AuthCtx())

	// router.With(auth.RequireAdmin()).Post("/", createCourseHandler)
	router.Post("/", createSectionHandler)
	// Get metadata about a course
	// router.Route("/{sectionID}", func(router chi.Router) {
	// 	router.Use(middleware.SectionCtx())
	// 	router.Get("/", getSectionHandler)

	// })

	return router
}

// // GET: /{sectionID}
func getSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("sectionID").(string)

	course, err := repo.Repository.GetCourseByID(courseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, course)
}

// POST:
func createSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	var req *models.CreateSectionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	c, err := repo.Repository.CreateSection(courseID, req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, c)
}
