package router

import (
	"fmt"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func CourseRoutes() *chi.Mux {
	router := chi.NewRouter()
	// All course routes require authentication.
	// router.Use(middleware.CourseCtx())

	// Modifying courses themselves
	// router.With(auth.RequireAdmin()).Post("/create", createCourseHandler)
	// Get metadata about a course
	router.Route("/{courseID}", func(router chi.Router) {
		router.Use(middleware.CourseCtx())

		router.Get("/", getCourseHandler)

		// Anybody authed can read a course

		// Only Admins can delete a course
		// router.With(auth.RequireAdmin()).Delete("/", deleteCourseHandler)

		// // Course modification
		// router.With(auth.RequireCourseAdmin()).Post("/edit", editCourseHandler)
		// router.With(auth.RequireCourseAdmin()).Post("/addPermission", addCoursePermissionHandler)
		// router.With(auth.RequireCourseAdmin()).Post("/removePermission", removeCoursePermissionHandler)
	})
	// router.With(auth.RequireAdmin()).Post("/bulkUpload", bulkUploadHandler)

	return router
}

// // GET: /{courseID}
func getCourseHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	fmt.Println(courseID)

	// course, err := repo.Repository.GetCourseByID(courseID)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	render.JSON(w, r, fmt.Sprintf("course %s", courseID))
}

// POST: /create
func createCourseHandler(w http.ResponseWriter, r *http.Request) {
	// var req *models.CreateCourseRequest

	// user, err := auth.GetUserFromRequest(r)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusUnauthorized)
	// }

	// err = json.NewDecoder(r.Body).Decode(&req)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }
	// req.CreatedBy = user

	// c, err := repo.Repository.CreateCourse(req)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// render.JSON(w, r, c)
}

// // DELETE: /{courseID}
// func deleteCourseHandler(w http.ResponseWriter, r *http.Request) {
// 	courseID := r.Context().Value("courseID").(string)

// 	err := repo.Repository.DeleteCourse(&models.DeleteCourseRequest{CourseID: courseID})
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(200)
// 	w.Write([]byte("Successfully deleted course " + courseID))
// }
