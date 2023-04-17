package middleware

import "net/http"

func rejectUnauthorizedRequest(w http.ResponseWriter) {
	http.Error(w, "You must be authenticated to access this resource", http.StatusUnauthorized)
}

func rejectBadRequest(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusBadRequest)
}

func rejectForbiddenRequest(w http.ResponseWriter) {
	http.Error(w, "You do not have permission to access this resource", http.StatusForbidden)
}
