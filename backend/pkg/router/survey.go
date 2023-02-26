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

func SurveyRoutes() *chi.Mux {
	router := chi.NewRouter()

	// TODO: Authentication
	router.Post("/", createSurveyHandler)
	router.Route("/{surveyID}", func(router chi.Router) {
		router.Use(middleware.SurveyCtx())
		router.Get("/", getSurveyHandler)
		router.Post("/", publishSurveyHandler)
		router.Mount("/responses", ResponsesRoutes())

	})
	return router
}

func ResponsesRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Post("/", createSurveyResponseHandler)
	router.Patch("/", updateSurveyResponseHandler)
	return router
}

func getSurveyHandler(w http.ResponseWriter, r *http.Request) {
	surveyID := r.Context().Value("surveyID").(string)

	survey, err := repo.Repository.GetSurveyByID(surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	render.JSON(w, r, survey)
}

func createSurveyHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.CreateSurveyRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get all the section times
	sections, err := repo.Repository.GetSectionByCourse(req.CourseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	survey := models.InitSurvey(req.Name, req.CourseID, sections)

	s, err := repo.Repository.CreateSurvey(survey)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: add the survey id to the course

	render.JSON(w, r, s)

}

func publishSurveyHandler(w http.ResponseWriter, r *http.Request) {
	// TODO:
}

func createSurveyResponseHandler(w http.ResponseWriter, r *http.Request) {
	surveyID := r.Context().Value("surveyID").(string)

	var req *models.CreateSurveyResponseRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// TODO: get user from auth middleware
	req.UserID = "USERID(Placeholder)"
	req.SurveyID = surveyID

	s, err := repo.Repository.CreateSurveyResponse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, s)
}

func updateSurveyResponseHandler(w http.ResponseWriter, r *http.Request) {
	// surveyID := r.Context().Value("surveyID").(string)

	// TODO:
}
