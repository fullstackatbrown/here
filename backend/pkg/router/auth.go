package router

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/config"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/middleware"
	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func AuthRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Route("/", func(r chi.Router) {
		r.Use(middleware.AuthCtx())
		r.Post("/", createUserHandler)
		r.Get("/me", getMeHandler)

		r.Patch("/joinCourse", joinCourseHandler)
		r.Patch("/quitCourse", quitCourseHandler)

		r.Route("/{userID}", func(r chi.Router) {
			r.Get("/", getUserHandler)
			// r.Patch("/", updateUserHandler)
		})

		r.Route("/notifications", func(r chi.Router) {
			r.Delete("/", clearAllNotificationsHandler)
			r.Delete("/{notificationID}", clearNotificationHandler)
		})

		// Edits site wide admin access
		r.With(middleware.RequireAdmin()).Patch("/editAdminAccess", editAdminAccessHandler)
	})

	// Alter the current session. No auth middlewares required.
	router.Post("/session", createSessionHandler)
	router.Post("/signout", signOutHandler)

	return router
}

func getMeHandler(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	render.JSON(w, r, struct {
		*models.Profile
		ID string
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
	userID := chi.URLParam(r, "userID")

	user, err := repo.Repository.GetUserByID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, user)
}

func joinCourseHandler(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromRequest(r)
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

	course, internalError, requestError := repo.Repository.HandleJoinCourseRequest(req)
	if internalError != nil {
		http.Error(w, internalError.Error(), http.StatusInternalServerError)
		return
	}
	if requestError != nil {
		http.Error(w, requestError.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully joined course " + course.Code))
}

func quitCourseHandler(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromRequest(r)
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

	err = repo.Repository.HandleQuitCourseRequest(req)
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

	wasAdmin, err := repo.Repository.EditAdminAccess(req)
	if wasAdmin {
		http.Error(w, "Already an admin", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully edited user " + req.Email))
}

// POST: /session
func createSessionHandler(w http.ResponseWriter, r *http.Request) {
	authClient, err := firebase.App.Auth(firebase.Context)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	var req struct {
		Token string `json:"token"`
	}

	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Set session expiration.
	expiresIn := config.Config.SessionCookieExpiration

	// Create the session cookie. This will also verify the ID token in the process.
	// The session cookie will have the same claims as the ID token.
	// To only allow session cookie setting on recent sign-in, auth_time in ID token
	// can be checked to ensure user was recently signed in before creating a session cookie.
	cookie, err := authClient.SessionCookie(firebase.Context, req.Token, expiresIn)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var sameSite http.SameSite
	if config.Config.IsCookieCrossSite {
		sameSite = http.SameSiteNoneMode
	} else {
		sameSite = http.SameSiteLaxMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     config.Config.SessionCookieName,
		Value:    cookie,
		MaxAge:   int(expiresIn.Seconds()),
		HttpOnly: true,
		SameSite: sameSite,
		Secure:   config.Config.IsCookieCrossSite,
		Path:     "/",
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success"))
}

// POST: /signout
func signOutHandler(w http.ResponseWriter, r *http.Request) {
	var sameSite http.SameSite
	if config.Config.IsCookieCrossSite {
		sameSite = http.SameSiteNoneMode
	} else {
		sameSite = http.SameSiteLaxMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     config.Config.SessionCookieName,
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: sameSite,
		Secure:   config.Config.IsCookieCrossSite,
		Path:     "/",
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success"))
}

// POST: notification clear
func clearNotificationHandler(w http.ResponseWriter, r *http.Request) {
	notificationID := chi.URLParam(r, "notificationID")
	user, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
	}

	err = repo.Repository.ClearNotification(user.ID, notificationID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully cleared notification"))
}

// POST: notification clear all
func clearAllNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
	}

	err = repo.Repository.ClearAllNotifications(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("Successfully cleared notification"))
}
