package router

import (
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func PrivacyRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.AuthCtx())
	router.Get("/data", handleAccessRequest)
	return router
}

func handleAccessRequest(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	render.JSON(w, r, repo.Repository.PrivacyPal.ProcessAccessRequest(user))
}
