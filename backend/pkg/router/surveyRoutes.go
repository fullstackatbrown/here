package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/go-chi/chi/v5"
)

func SurveyRoutes() *chi.Mux {
	router := chi.NewRouter()

	// TODO: Authentication
	router.Post("/", createSurveyHandler)
	router.Route("/{courseID}", func(r chi.Router) {
		r.Use(middleware.CourseCtx())
	})
	return router
}

func createSurveyHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.CreateSurveyRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get all the section times
	// sections, err := repo.Repository.ListCourseSections(req.CourseID)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// Get all the unique times

	// Create survey

}
