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

func SectionRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.RequireCourseAdmin())
	router.Use(middleware.RequireCourseActive())

	router.Post("/", createSectionHandler)

	router.Route("/{sectionID}", func(router chi.Router) {
		router.Delete("/", deleteSectionHandler)
		router.Patch("/", updateSectionHandler)
	})

	return router
}

func createSectionHandler(w http.ResponseWriter, r *http.Request) {
	course := r.Context().Value("course").(*models.Course)
	var req *models.CreateSectionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.Course = course

	// Check if a section with the same time and location already exists
	s, err := repo.Repository.GetSectionByInfo(course, req.StartTime, req.EndTime, req.Location)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if s != nil {
		http.Error(w, "A section with the same time and location already exists", http.StatusBadRequest)
		return
	}

	c, err := repo.Repository.CreateSection(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, c)
}

func updateSectionHandler(w http.ResponseWriter, r *http.Request) {
	course := r.Context().Value("course").(*models.Course)
	sectionID := chi.URLParam(r, "sectionID")
	var req *models.UpdateSectionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.Course = course
	req.SectionID = &sectionID

	err = repo.Repository.UpdateSection(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated section " + sectionID))
}

func deleteSectionHandler(w http.ResponseWriter, r *http.Request) {
	course := r.Context().Value("course").(*models.Course)
	sectionID := chi.URLParam(r, "sectionID")

	err := repo.Repository.DeleteSection(&models.DeleteSectionRequest{Course: course, SectionID: sectionID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted section " + sectionID))
}
