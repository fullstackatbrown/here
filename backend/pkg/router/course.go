package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/fullstackatbrown/here/pkg/sectionallocation"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func CourseRoutes() *chi.Mux {
	router := chi.NewRouter()
	// All course routes require authentication.
	// router.Use(middleware.AuthCtx())

	// router.With(auth.RequireAdmin()).Post("/", createCourseHandler)
	router.Post("/", createCourseHandler)
	// Get metadata about a course
	router.Route("/{courseID}", func(r chi.Router) {
		r.Use(middleware.CourseCtx())

		r.Get("/", getCourseHandler)

		// Only Admins can delete a course
		// router.With(auth.RequireAdmin()).Delete("/", deleteCourseHandler)
		r.Delete("/", deleteCourseHandler)
		r.Post("/assignSections", assignSectionsHandler)

		r.Mount("/sections", SectionRoutes())
	})

	return router
}

// // GET: /{courseID}
func getCourseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)

	course, err := repo.Repository.GetCourseByID(courseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, course)
}

// POST: /
func createCourseHandler(w http.ResponseWriter, r *http.Request) {

	var req *models.CreateCourseRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	c, err := repo.Repository.CreateCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, c)
}

// DELETE: /{courseID}
func deleteCourseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)

	err := repo.Repository.DeleteCourse(&models.DeleteCourseRequest{CourseID: courseID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted course " + courseID))
}

func assignSectionsHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	course, err := repo.Repository.GetCourseByID(courseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	survey, err := repo.Repository.GetSurveyByID(course.SurveyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res, _, err := sectionallocation.AssignSections(survey.Capacity, survey.Responses)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	render.JSON(w, r, res)
}
