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
			sectionID := chi.URLParam(r, "sectionID")

			ctx := context.WithValue(r.Context(), "sectionID", sectionID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func AssignmentCtx() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			assignmentID := chi.URLParam(r, "assignmentID")

			ctx := context.WithValue(r.Context(), "assignmentID", assignmentID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func SwapCtx() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			swapID := chi.URLParam(r, "swapID")

			ctx := context.WithValue(r.Context(), "swapID", swapID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func SurveyCtx() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			surveyID := chi.URLParam(r, "surveyID")

			ctx := context.WithValue(r.Context(), "surveyID", surveyID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GradeCtx() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			gradeID := chi.URLParam(r, "gradeID")

			ctx := context.WithValue(r.Context(), "gradeID", gradeID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
