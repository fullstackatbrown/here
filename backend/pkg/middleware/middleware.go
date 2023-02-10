package middleware

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func CourseCtx() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			courseID := chi.URLParam(r, "courseID")

			ctx := context.WithValue(r.Context(), "courseID", courseID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func SectionCtx() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			courseID := chi.URLParam(r, "sectionID")

			ctx := context.WithValue(r.Context(), "sectionID", courseID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func SurveyCtx() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			courseID := chi.URLParam(r, "surveyID")

			ctx := context.WithValue(r.Context(), "surveyID", courseID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
