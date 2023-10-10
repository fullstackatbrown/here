package router

import (
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	pal "github.com/tianrendong/privacy-pal"
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

	locator := pal.Locator{
		ID:         user.ID,
		Collection: "user_profiles",
		DataNode:   &models.Profile{},
	}

	ret, err := repo.Repository.PrivacyPal.ProcessAccessRequest(locator, user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, ret)
}
