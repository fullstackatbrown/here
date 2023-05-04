package router

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fullstackatbrown/here/pkg/config"
	"github.com/fullstackatbrown/here/pkg/middleware"
	repo "github.com/fullstackatbrown/here/pkg/repository"
	"github.com/go-chi/chi/v5"
)

func GapiRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.With(middleware.RequireCourseAdmin()).Post("/email", sendEmailHandler)
	router.With(middleware.RequireCourseAdmin()).Post("/gcal/event", createGcalEventHandler)

	return router
}

func authorizeGapiCallbackHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Include courseID in state
	// TODO: Check OAuth state
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")

	type State struct {
		RedirectUrl string `json:"redirectUrl"`
		CourseID    string `json:"courseID"`
	}

	var stateObj State
	err := json.Unmarshal([]byte(state), &stateObj)
	if err != nil {
		// TODO: redirect
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	token, err := config.Config.OAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		fmt.Println(err)
		http.Redirect(w, r, stateObj.RedirectUrl, http.StatusPermanentRedirect)
		// TODO: how to Redirect with error?
		// http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println("courseID:" + stateObj.CourseID)
	fmt.Println("accesstoken: " + token.AccessToken)
	fmt.Println("refreshtoken: " + token.RefreshToken)

	err = repo.Repository.SetGapiClient(stateObj.CourseID, token)
	if err != nil {
		// TODO: redirect
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Redirect to course page
	http.Redirect(w, r, stateObj.RedirectUrl, http.StatusPermanentRedirect)
}

func sendEmailHandler(w http.ResponseWriter, r *http.Request) {
	courseID := chi.URLParam(r, "courseID")
	// var req *models.SendEmailRequest

	course, err := repo.Repository.GetCourseByID(courseID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(course.GapiClient)
	course.GapiLock.Lock()
	fmt.Println("here")
	defer course.GapiLock.Unlock()

	// srv, err := gmail.NewService(context.Background(), option.WithHTTPClient(course.GapiClient))
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// }

	// to := "jenny_yu2@gmail.com"
	// subject := "Test Email"
	// body := "Hello World!"

	// message := gmail.Message{
	// 	Raw: encodeMessage(to, subject, body),
	// }

	// _, err = srv.Users.Messages.Send("me", &message).Do()
	// if err != nil {
	// 	fmt.Println(err)
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// }
	// if err != nil {
	// 	fmt.Println(err)
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// }

}

func createGcalEventHandler(w http.ResponseWriter, r *http.Request) {
}

func encodeMessage(to, subject, body string) string {
	var message bytes.Buffer
	message.WriteString("To: " + to + "\r\n")
	message.WriteString("Subject: " + subject + "\r\n")
	message.WriteString("\r\n" + body)
	return base64.URLEncoding.EncodeToString(message.Bytes())
}
