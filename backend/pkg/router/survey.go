package router

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/fullstackatbrown/here/pkg/utils"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func SurveyRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.RequireCourseActive())
	router.With(middleware.RequireCourseAdmin()).Post("/", createSurveyHandler)

	router.Route("/{surveyID}", func(router chi.Router) {

		router.Route("/", func(router chi.Router) {
			router.Use(middleware.RequireCourseAdmin())
			router.Patch("/", updateSurveyHandler)
			router.Delete("/", deleteSurveyHandler)
			router.Post("/publish", publishSurveyHandler)
			router.Post("/results", generateResultsHandler)
			router.Post("/results/apply", applyResultsHandler)
		})

		router.Route("/responses", func(router chi.Router) {
			router.Post("/", createSurveyResponseHandler)
			router.With(middleware.RequireCourseAdmin()).Get("/", getSurveyResponseHandler)
		})

	})
	return router
}

func createSurveyHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")

	var req *models.CreateSurveyRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID

	s, err := repo.Repository.CreateSurvey(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, s)
}

func updateSurveyHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: what if the survey is already published
	courseID := chi.URLParam(r, "courseID")
	surveyID := chi.URLParam(r, "surveyID")

	var req *models.UpdateSurveyRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.SurveyID = &surveyID
	req.CourseID = &courseID

	_, err = repo.Repository.GetSurveyByID(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = repo.Repository.UpdateSurvey(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated survey " + surveyID))
}

func deleteSurveyHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	surveyID := chi.URLParam(r, "surveyID")

	err := repo.Repository.DeleteSurvey(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted survey " + surveyID))
}

func publishSurveyHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	surveyID := chi.URLParam(r, "surveyID")

	survey, err := repo.Repository.GetSurveyByID(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	surveyEndTime, err := time.Parse(time.RFC3339, survey.EndTime)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if surveyEndTime.Before(time.Now()) {
		http.Error(w, "Survey's end time is in the past\n", http.StatusBadRequest)
		return
	}

	err = repo.Repository.PublishSurvey(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully published survey " + surveyID))
}

func generateResultsHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	surveyID := chi.URLParam(r, "surveyID")

	survey, err := repo.Repository.GetSurveyByID(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res, exceptions := utils.RunAllocationAlgorithm(survey.Capacity, survey.Responses)
	res = utils.HandleExceptions(survey.Responses, res, exceptions)

	// res is a map from section id to list of studentIDs
	res = utils.GetAssignedSections(res, survey.Capacity)
	repo.Repository.UpdateSurveyResults(courseID, surveyID, res)

	w.WriteHeader(200)
	w.Write([]byte("Successfully generated results for survey " + surveyID))
}

func applyResultsHandler(w http.ResponseWriter, r *http.Request) {
	course := r.Context().Value("course").(*models.Course)
	surveyID := chi.URLParam(r, "surveyID")

	err := repo.Repository.ApplySurveyResults(course, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully confirmed survey results " + surveyID))
}

func createSurveyResponseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	surveyID := chi.URLParam(r, "surveyID")
	user, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if !utils.Contains(user.Courses, courseID) {
		http.Error(w, "You have to be enrolled in the course to submit a survey response", http.StatusUnauthorized)
		return
	}

	survey, requestErr, internalErr := repo.Repository.ValidateSurveyActive(courseID, surveyID)
	if internalErr != nil {
		http.Error(w, internalErr.Error(), http.StatusInternalServerError)
		return
	}
	if requestErr != nil {
		http.Error(w, requestErr.Error(), http.StatusBadRequest)
		return
	}

	var req *models.CreateSurveyResponseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID
	req.Survey = survey
	req.User = user

	s, err := repo.Repository.CreateSurveyResponse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, s)
}

func getSurveyResponseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	surveyID := chi.URLParam(r, "surveyID")

	responses, err := repo.Repository.GetSurveyResponses(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, responses)
}
