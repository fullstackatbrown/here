package router

import (
	"net/http"

	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func PrivacyRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Get("/data", handleAccessRequest)
	return router
}

func handleAccessRequest(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userID")

	user, err := repo.Repository.GetUserByID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, repo.Repository.PrivacyPal.ProcessAccessRequest(user))
}
