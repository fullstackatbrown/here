package middleware

import (
	"context"
	"fmt"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/models"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
)

func CourseCtx() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			courseID := chi.URLParam(r, "courseID")

			course, err := repo.Repository.GetCourseByID(courseID)
			if err != nil {
				rejectNotFound(w, err)
			}

			ctx := context.WithValue(r.Context(), "course", course)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func RequireCourseActive() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			course := r.Context().Value("course").(*models.Course)

			if course.Status != models.CourseActive {
				rejectBadRequest(w, fmt.Errorf("Cannot perform this operation on a %s course", course.Status))
				return
			}

			next.ServeHTTP(w, r)
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

			course := r.Context().Value("course").(*models.Course)
			if !hasCourseAdminPermission(user, course.ID) {
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

			course := r.Context().Value("course").(*models.Course)
			if !hasCourseStaffPermission(user, course.ID) {
				rejectForbiddenRequest(w)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func RequireCourseOrSiteAdmin() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, err := GetUserFromRequest(r)
			if err != nil {
				rejectUnauthorizedRequest(w)
				return
			}

			course := r.Context().Value("course").(*models.Course)
			if !hasCourseStaffPermission(user, course.ID) && !user.IsAdmin {
				rejectForbiddenRequest(w)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func hasCourseStaffPermission(u *models.User, courseID string) bool {
	_, ok := u.Permissions[courseID]
	return ok
}

func hasCourseAdminPermission(u *models.User, courseID string) bool {
	perm, ok := u.Profile.Permissions[courseID]
	return ok && perm == models.CourseAdmin
}
