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

	router.Use(auth.AuthCtx())
	router.Post("/", createUserHandler)
	router.Get("/me", getMeHandler)

	router.Route("/{userID}", func(r chi.Router) {
		r.Get("/", getUserHandler)
		// r.Patch("/", updateUserHandler)
		r.Patch("/joinCourse", joinCourseHandler)
		r.Patch("/quitCourse", quitCourseHandler)
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
	var req *models.CreateUserRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	c, err := repo.Repository.CreateUser(req)
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

func joinCourseHandler(w http.ResponseWriter, r *http.Request) {
	user, err := auth.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req *models.JoinCourseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.User = user

	course, err := repo.Repository.JoinCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully joined course " + course.ID))
}

func quitCourseHandler(w http.ResponseWriter, r *http.Request) {
	user, err := auth.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req *models.QuitCourseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.UserID = user.ID

	err = repo.Repository.QuitCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully quit course " + req.CourseID))
}
