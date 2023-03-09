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
		router.Post("/", updateSurveyHandler)
		router.Post("/publish", publishSurveyHandler)
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
	courseID := r.Context().Value("courseID").(string)
	var req *models.CreateSurveyRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID

	// TODO: deny the request if a survey already exists under the course

	// Get all the section times
	sections, err := repo.Repository.GetSectionByCourse(req.CourseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	survey := models.InitSurvey(req, sections)

	s, err := repo.Repository.CreateSurvey(survey)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, s)

}

func updateSurveyHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: what if the survey is already published
	surveyID := r.Context().Value("surveyID").(string)
	var req *models.UpdateSurveyRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	survey, err := repo.Repository.GetSurveyByID(surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get all the section times
	sections, err := repo.Repository.GetSectionByCourse(req.CourseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	survey.Update(req, sections)

	err = repo.Repository.UpdateSurvey(surveyID, survey)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, survey)

}

func publishSurveyHandler(w http.ResponseWriter, r *http.Request) {
	surveyID := r.Context().Value("surveyID").(string)
	err := repo.Repository.PublishSurvey(surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully published survey " + surveyID))
}

func createSurveyResponseHandler(w http.ResponseWriter, r *http.Request) {
	surveyID := r.Context().Value("surveyID").(string)

	var req *models.CreateSurveyResponseRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.SurveyID = surveyID

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
