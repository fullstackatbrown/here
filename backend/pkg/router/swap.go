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

	router.Use(middleware.RequireCourseActive())
	router.Post("/", createSwapHandler)
	router.Route("/{swapID}", func(router chi.Router) {
		router.Patch("/", updateSwapHandler)
		router.With(middleware.RequireCourseStaff()).Patch("/handle", handleSwapHandler)
		router.Patch("/cancel", cancelSwapHandler)
	})

	return router
}

func createSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	user, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req *models.CreateSwapRequest

	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID
	req.User = user

	// Whether if student is already in the section is checked in frontend

	swap, badRequestErr, internalErr := repo.Repository.CreateSwap(req)
	if badRequestErr != nil {
		http.Error(w, badRequestErr.Error(), http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, internalErr.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, swap)
}

func updateSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	swapID := chi.URLParam(r, "swapID")

	user, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req *models.UpdateSwapRequest

	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID
	req.SwapID = swapID
	req.User = user

	requestErr, internalErr := repo.Repository.UpdateSwap(req)
	if requestErr != nil {
		http.Error(w, requestErr.Error(), http.StatusBadRequest)
		return
	}
	if internalErr != nil {
		http.Error(w, internalErr.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated swap request " + swapID))

}

func handleSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	swapID := chi.URLParam(r, "swapID")
	handledBy, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req *models.HandleSwapRequest

	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.CourseID = courseID
	req.SwapID = swapID
	req.HandledBy = handledBy

	err = repo.Repository.HandleSwap(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully updated swap request to status " + req.Status))
}

func cancelSwapHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	swapID := chi.URLParam(r, "swapID")

	swap, err := repo.Repository.GetSwapByID(courseID, swapID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// only allow cancel if it's still pending
	if swap.Status != "pending" {
		http.Error(w, "Swap is not pending", http.StatusBadRequest)
		return
	}

	err = repo.Repository.CancelSwap(courseID, swapID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully cancelled swap request " + swapID))
}
