package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/qerrors"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
)

func CourseRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.AuthCtx())
	router.With(middleware.RequireAdmin()).Post("/", createCourseHandler)
	router.With(middleware.RequireAdmin()).Post("/bulkUpload", bulkUploadHandler)

	router.Route("/{courseID}", func(r chi.Router) {
		r.Use(middleware.CourseCtx())

		// site admin only
		r.With(middleware.RequireAdmin()).Delete("/", deleteCourseHandler)
		r.With(middleware.RequireAdmin()).Patch("/info", updateCourseInfoHandler)

		// course admin only
		r.With(middleware.RequireCourseAdmin()).Patch("/", updateCourseHandler)
		r.With(middleware.RequireCourseAdmin()).With(middleware.RequireCourseActive()).Post("/assignSection", assignSectionHandler)

		r.Mount("/sections", SectionRoutes())
		r.Mount("/assignments", AssignmentRoutes())
		r.Mount("/swaps", SwapRoutes())
		r.Mount("/surveys", SurveyRoutes())
		r.Mount("/permissions", PermissionRoutes())
	})

	return router
}

func createCourseHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.CreateCourseRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err = repo.Repository.GetCourseByInfo(req.Code, req.Term)
	if err == nil {
		http.Error(w, qerrors.CourseAlreadyExistsError.Error(), http.StatusBadRequest)
		return
	} else if err != qerrors.CourseNotFoundError {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = repo.Repository.CreateCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully created course " + req.Code))
}

func deleteCourseHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: we should use a helper to get the course, so we can throw a bad request error when there is no course, like GetUserFromRequest
	course := r.Context().Value("course").(*models.Course)

	// Cannot delete course if currently active or archived
	if course.Status != models.CourseInactive {
		http.Error(w, "Course is currently active or has students", http.StatusBadRequest)
		return
	}

	err := repo.Repository.DeleteCourse(&models.DeleteCourseRequest{CourseID: course.ID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully deleted course " + course.ID))
}

func updateCourseHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: we should use a helper to get the course, so we can throw a bad request error when there is no course, like GetUserFromRequest
	course := r.Context().Value("course").(*models.Course)

	var req *models.UpdateCourseRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = &course.ID

	err = repo.Repository.UpdateCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated course " + course.ID))
}

func updateCourseInfoHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: we should use a helper to get the course, so we can throw a bad request error when there is no course, like GetUserFromRequest
	course := r.Context().Value("course").(*models.Course)

	var req *models.UpdateCourseInfoRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = &course.ID

	err = repo.Repository.UpdateCourseInfo(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated course status " + course.ID))
}

func assignSectionHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: we should use a helper to get the course, so we can throw a bad request error when there is no course, like GetUserFromRequest
	course := r.Context().Value("course").(*models.Course)

	var req *models.AssignSectionsRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.Course = course

	err = repo.Repository.AssignStudentToSection(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully assigned section for student " + req.StudentID))
}

func bulkUploadHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.BulkUploadRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	badRequestErrors, err := repo.Repository.BulkUpload(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(badRequestErrors) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(badRequestErrors)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Successfully uploaded all permission"))
}
