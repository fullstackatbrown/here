package router

import (
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/go-chi/chi/v5"
)

func SwapRoutes() *chi.Mux {
	router := chi.NewRouter()
	// router.Use(middleware.AuthCtx())

	router.Post("/", createSwapRequestHandler)
	router.Get("/", getAllSwapRequestsHandler)
	router.Route("/{swapID}", func(router chi.Router) {
		router.Use(middleware.SwapCtx())
		router.Get("/me", getSwapRequestByStudentHandler)
		router.Patch("/", updateSwapRequestHandler)

	})

	return router
}

func getAllSwapRequestsHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("sectionID").(string)

	// TODO:

	// render.JSON(w, r, course)
}

func getSwapRequestByStudentHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("sectionID").(string)

	// TODO:

	// render.JSON(w, r, course)
}

func createSwapRequestHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("courseID").(string)
	// var req *models.CreateAssignmentRequest

	// err := json.NewDecoder(r.Body).Decode(&req)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// TODO:
	// render.JSON(w, r, c)
}

func updateSwapRequestHandler(w http.ResponseWriter, r *http.Request) {
	// courseID := r.Context().Value("courseID").(string)
	// var req *models.UpdateSectionRequest

	// err := json.NewDecoder(r.Body).Decode(&req)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// TODO:
}
