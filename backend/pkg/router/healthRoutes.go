package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func HealthRoutes() *chi.Mux {
	router := chi.NewRouter()

	// Serve a welcome/health route
	router.Get("/", health)
	return router
}

// GET: /
func health(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
	w.Write([]byte("Welcome to the API!"))
}
