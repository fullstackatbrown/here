package router

import (
	"net/http"

	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/fullstackatbrown/here/pkg/privacy"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	pal "github.com/privacy-pal/privacy-pal/go/pkg"
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
		LocatorType: pal.Document,
		DataType:    privacy.UserDataType,
		FirestoreLocator: pal.FirestoreLocator{
			DocIDs:         []string{user.ID},
			CollectionPath: []string{models.FirestoreProfilesCollection},
		},
	}

	data, err := repo.Repository.PrivacyPal.ProcessAccessRequest(privacy.HandleAccess, locator, user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	render.JSON(w, r, data)
}
