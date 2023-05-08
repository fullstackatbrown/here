package firebase

import (
	"context"

	firebaseSDK "firebase.google.com/go"
	"github.com/fullstackatbrown/here/pkg/config"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

// App is a global variable to hold the initialized Firebase App object
var App *firebaseSDK.App
var Context context.Context

func initializeFirebaseApp() {
	ctx := context.Background()
	opt := option.WithCredentialsJSON(config.Config.FirebaseConfig)
	app, err := firebaseSDK.NewApp(ctx, nil, opt)
	if err != nil {
		panic(err.Error())
	}

	App = app
	Context = ctx
}

func init() {
	godotenv.Load()
	initializeFirebaseApp()
}
