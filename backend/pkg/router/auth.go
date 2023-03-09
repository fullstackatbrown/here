package router

import (
	"encoding/json"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/auth"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func AuthRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Post("/", createUserHandler)
	router.Route("/{userID}", func(r chi.Router) {
		r.Use(auth.AuthCtx())
		r.Get("/", getUserHandler)
		// r.Patch("/", updateUserHandler)
		r.Patch("/courses", joinOrQuitCourseHandler)
	})

	return router
}

func getMeHandler(w http.ResponseWriter, r *http.Request) {
	user, err := auth.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	render.JSON(w, r, struct {
		*models.Profile
		ID string `json:"id"`
	}{user.Profile, user.ID})
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.CreateUserProfileRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	c, err := repo.Repository.CreateUserProfile(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, c)
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	user, err := repo.Repository.GetUserByID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, user)
}

func joinOrQuitCourseHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	var req *models.JoinOrQuitCourseRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.UserID = userID

	if req.Action == models.ACTION_JOIN {
		err = repo.Repository.JoinCourse(req)

	} else if req.Action == models.ACTION_QUIT {
		err = repo.Repository.QuitCourse(req)
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Request success"))

}
