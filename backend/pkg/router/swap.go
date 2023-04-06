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

func SwapRoutes() *chi.Mux {
	router := chi.NewRouter()
	// router.Use(middleware.AuthCtx())

	router.Post("/", createSwapHandler)
	router.Route("/{swapID}", func(router chi.Router) {
		router.Use(middleware.SwapCtx())
		router.Patch("/", updateSwapHandler)
		router.Patch("/handle", handleSwapHandler)
		router.Delete("/", cancelSwapHandler)
	})

	return router
}

func createSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	var req *models.CreateSwapRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID

	swap, err := repo.Repository.CreateSwap(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: automatically handle swap based on availability

	render.JSON(w, r, swap)
}

func updateSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	swapID := r.Context().Value("swapID").(string)
	var req *models.UpdateSwapRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = &courseID
	req.SwapID = &swapID

	err = repo.Repository.UpdateSwap(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated swap request " + swapID))

}

func handleSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	swapID := r.Context().Value("swapID").(string)
	var req *models.HandleSwapRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID
	req.SwapID = swapID

	err = repo.Repository.HandleSwap(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated swap request to status " + req.Status))
}

func cancelSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := r.Context().Value("courseID").(string)
	swapID := r.Context().Value("swapID").(string)

	err := repo.Repository.CancelSwap(courseID, swapID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully cancelled swap request " + swapID))
}
