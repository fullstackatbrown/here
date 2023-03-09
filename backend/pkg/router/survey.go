package router

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/fullstackatbrown/here/pkg/utils"
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
		router.Post("/results", generateResultsHandler)
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

func generateResultsHandler(w http.ResponseWriter, r *http.Request) {
	surveyID := r.Context().Value("surveyID").(string)

	survey, err := repo.Repository.GetSurveyByID(surveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(survey)
	res, exceptions := utils.RunAllocationAlgorithm(survey.Capacity, survey.Responses)
	// res is a map from section id to list of studentIDs
	res = utils.GetAssignedSections(res, survey.Capacity)
	repo.Repository.UpdateSurveyResults(surveyID, res, exceptions)

	var readableResults []models.GenerateResultsResponseItem

	for sectionID, studentIDs := range res {
		section, err := repo.Repository.GetSectionByID(sectionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var students []string
		for _, studentID := range studentIDs {
			student, err := repo.Repository.GetUserByID(studentID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			students = append(students, student.DisplayName)
		}

		readableResults = append(readableResults, models.GenerateResultsResponseItem{Section: *section, Students: students})
	}

	render.JSON(w, r, readableResults)
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
