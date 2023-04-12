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

	router.Patch("/joinCourse", joinCourseHandler)
	router.Patch("/quitCourse", quitCourseHandler)

	router.Route("/{userID}", func(r chi.Router) {
		r.Get("/", getUserHandler)
		// r.Patch("/", updateUserHandler)
	})

	router.With(auth.RequireAdmin()).Patch("/editAdminAccess", editAdminAccessHandler)

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

	course, internalError, requestError := repo.Repository.ValidateJoinCourseRequest(req)
	if internalError != nil {
		http.Error(w, internalError.Error(), http.StatusInternalServerError)
		return
	}
	if requestError != nil {
		http.Error(w, requestError.Error(), http.StatusBadRequest)
		return
	}

	course, err = repo.Repository.JoinCourse(req, course)
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

	req.User = user

	err = repo.Repository.QuitCourse(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully quit course " + req.CourseID))
}

func editAdminAccessHandler(w http.ResponseWriter, r *http.Request) {
	var req *models.EditAdminAccessRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = repo.Repository.EditAdminAccess(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	_, err = w.Write([]byte("Successfully edited user " + req.Email))
	if err != nil {
		return
	}
}
