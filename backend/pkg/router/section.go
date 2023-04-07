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
	// All course routes require authentication.
	// router.Use(middleware.AuthCtx())

	router.Post("/", createSectionHandler)
	router.Route("/{sectionID}", func(router chi.Router) {
		router.Use(middleware.SectionCtx())
		router.Get("/", getSectionHandler)
		router.Delete("/", deleteSectionHandler)
		router.Patch("/", updateSectionHandler)

	})

	return router
}

func getSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	sectionID := r.Context().Value("sectionID").(string)

	section, err := repo.Repository.GetSectionByID(courseID, sectionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, section)
}

func createSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	var req *models.CreateSectionRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID

	c, err := repo.Repository.CreateSection(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, c)
}

func updateSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	sectionID := r.Context().Value("sectionID").(string)
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
	courseID := r.Context().Value("courseID").(string)
	sectionID := r.Context().Value("sectionID").(string)

	err := repo.Repository.DeleteSection(&models.DeleteSectionRequest{CourseID: courseID, SectionID: sectionID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted section " + sectionID))
}
