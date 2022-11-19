package firebase

import (
	"context"

	"github.com/fullstackatbrown/here/pkg/config"

	firebaseSDK "firebase.google.com/go"
	"google.golang.org/api/option"
)

// App is a global variable to hold the initialized Firebase App object
var App *firebaseSDK.App
var Context context.Context

func initializeFirebaseApp() {
	ctx := context.Background()
	opt := option.WithCredentialsFile(config.Config.FirebaseConfig)
	app, err := firebaseSDK.NewApp(ctx, nil, opt)
	if err != nil {
		panic(err.Error())
	}

	App = app
	Context = ctx
}

func init() {
	initializeFirebaseApp()
}
