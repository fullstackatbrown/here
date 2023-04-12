package middleware

import (
	"context"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/models"
	"github.com/go-chi/chi/v5"
)

func CourseCtx() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			queueID := chi.URLParam(r, "courseID")

			ctx := context.WithValue(r.Context(), "courseID", queueID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func RequireCourseAdmin() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, err := GetUserFromRequest(r)
			if err != nil {
				rejectUnauthorizedRequest(w)
				return
			}

			courseID := r.Context().Value("courseID").(string)
			if !hasCourseAdminPermission(user, courseID) {
				rejectForbiddenRequest(w)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func RequireCourseStaff() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, err := GetUserFromRequest(r)
			if err != nil {
				rejectUnauthorizedRequest(w)
				return
			}

			courseID := r.Context().Value("courseID").(string)
			if !hasCourseStaffPermission(user, courseID) {
				rejectForbiddenRequest(w)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func hasCourseStaffPermission(u *models.User, courseID string) bool {
	// TODO: admin does not necessarily have staff permissions
	if u.IsAdmin {
		return true
	}

	if _, ok := u.Permissions[courseID]; !ok {
		return false
	}

	return true
}

func hasCourseAdminPermission(u *models.User, courseID string) bool {
	if u.IsAdmin {
		return true
	}

	var ok bool
	var p models.CoursePermission
	if p, ok = u.Permissions[courseID]; !ok {
		return false
	}
	return p == models.CourseAdmin
}
