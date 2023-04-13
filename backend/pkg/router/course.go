package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func CourseRoutes() *chi.Mux {
	router := chi.NewRouter()
	// TODO: All course routes require authentication.
	// router.Use(middleware.AuthCtx())

	// router.With(auth.RequireAdmin()).Post("/", createCourseHandler)
	router.Post("/", createCourseHandler)
	router.Route("/{courseID}", func(r chi.Router) {
		r.Get("/", getCourseHandler)
		r.Delete("/", deleteCourseHandler)
		r.Patch("/", updateCourseHandler)
		r.Post("/assignSection", assignSectionHandler)

		r.Mount("/sections", SectionRoutes())
		r.Mount("/assignments", AssignmentRoutes())
		r.Mount("/swaps", SwapRoutes())
		r.Mount("/surveys", SurveyRoutes())

		r.Mount("/permissions", PermissionRoutes())
	})

	return router
}

func getCourseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")

	course, err := repo.Repository.GetCourseByID(courseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, course)
}

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

func deleteCourseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")

	course, err := repo.Repository.GetCourseByID(courseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Cannot delete course if currently active or archived
	if course.Status != models.CourseInactive {
		http.Error(w, "Course is currently active or has students", http.StatusBadRequest)
		return
	}

	err = repo.Repository.DeleteCourse(&models.DeleteCourseRequest{CourseID: courseID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted course " + courseID))
}

func updateCourseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")

	var req *models.UpdateCourseRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = &courseID

	err = repo.Repository.UpdateCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated course " + courseID))
}

func assignSectionHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")

	var req *models.AssignSectionsRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID

	err = repo.Repository.AssignStudentToSection(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully assigned sections to course " + courseID))

}
