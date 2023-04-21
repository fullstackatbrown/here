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
			router.Post("/confirmResults", confirmResultsHandler)
		})

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

	survey, err := repo.Repository.GetSurveyByID(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Get all the section times
	sections, err := repo.Repository.GetSectionByCourse(*req.CourseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	capacity, err := models.GetUniqueSectionTimes(sections)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = repo.Repository.UpdateSurvey(req, capacity)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, survey)

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

	readableResults, err := generateReadableResults(courseID, res)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, readableResults)
}

func confirmResultsHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	surveyID := r.Context().Value("surveyID").(string)

	err := repo.Repository.ConfirmSurveyResults(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: send notification to students

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

	survey, err := repo.Repository.GetSurveyByID(courseID, surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// check if survey is published
	if survey.Published == false {
		http.Error(w, "Survey is not published", http.StatusBadRequest)
		return
	}

	// check if survey ended
	surveyEndTime, err := time.Parse(time.RFC3339, survey.EndTime)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if surveyEndTime.Before(time.Now()) {
		http.Error(w, "Survey already ended\n", http.StatusBadRequest)
		return
	}

	var req *models.CreateSurveyResponseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.SurveyID = surveyID
	req.User = user

	// TODO: check if student is in the course

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

// Helpers
func generateReadableResults(courseID string, results map[string][]string) (readableResults []models.GenerateResultsResponseItem, err error) {
	readableResults = make([]models.GenerateResultsResponseItem, 0)

	for sectionID, studentIDs := range results {
		section, err := repo.Repository.GetSectionByID(courseID, sectionID)
		if err != nil {
			return nil, err
		}

		var students []string
		for _, studentID := range studentIDs {
			student, err := repo.Repository.GetUserByID(studentID)
			if err != nil {
				return nil, err
			}
			students = append(students, student.DisplayName)
		}

		readableResults = append(readableResults, models.GenerateResultsResponseItem{Section: *section, Students: students})
	}

	return
}
