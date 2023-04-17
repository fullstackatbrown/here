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

	router.With(middleware.RequireCourseAdmin()).Post("/", createSectionHandler)

	router.Route("/{sectionID}", func(router chi.Router) {
		router.With(middleware.RequireCourseStaff()).Get("/", getSectionHandler)
		router.With(middleware.RequireCourseAdmin()).Delete("/", deleteSectionHandler)
		router.With(middleware.RequireCourseAdmin()).Patch("/", updateSectionHandler)
	})

	return router
}

func getSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	sectionID := chi.URLParam(r, "sectionID")

	section, err := repo.Repository.GetSectionByID(courseID, sectionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, section)
}

func createSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	var req *models.CreateSectionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID

	// Check if a section with the same time and location already exists
	s, err := repo.Repository.GetSectionByInfo(courseID, req.StartTime, req.EndTime, req.Location)
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
	courseID := chi.URLParam(r, "courseID")
	sectionID := chi.URLParam(r, "sectionID")
	var req *models.UpdateSectionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = &courseID
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
	courseID := chi.URLParam(r, "courseID")
	sectionID := chi.URLParam(r, "sectionID")

	err := repo.Repository.DeleteSection(&models.DeleteSectionRequest{CourseID: courseID, SectionID: sectionID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted section " + sectionID))
}
