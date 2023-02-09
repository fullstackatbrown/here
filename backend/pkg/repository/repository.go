package repository

import (
	"fmt"
	"log"
	"sync"

	firebaseAuth "firebase.google.com/go/auth"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"github.com/fullstackatbrown/here/pkg/models"

	"cloud.google.com/go/firestore"
)

var Repository *FirebaseRepository

func init() {
	var err error
	Repository, err = NewFirebaseRepository()
	if err != nil {
		log.Panicf("Error creating repository: %v\n", err)
	}

	log.Printf("✅ Successfully created Firebase repository client")
}

type FirebaseRepository struct {
	authClient      *firebaseAuth.Client
	firestoreClient *firestore.Client

	coursesLock *sync.RWMutex
	courses     map[string]*models.Course

	profilesLock *sync.RWMutex
	profiles     map[string]*models.Profile
}

func NewFirebaseRepository() (*FirebaseRepository, error) {
	fr := &FirebaseRepository{
		coursesLock: &sync.RWMutex{},
		courses:     make(map[string]*models.Course),

		profilesLock: &sync.RWMutex{},
		profiles:     make(map[string]*models.Profile),
	}

	authClient, err := firebase.App.Auth(firebase.Context)
	if err != nil {
		return nil, fmt.Errorf("Auth client error: %v\n", err)
	}
	fr.authClient = authClient

	firestoreClient, err := firebase.App.Firestore(firebase.Context)
	if err != nil {
		return nil, fmt.Errorf("Firestore client error: %v\n", err)
	}
	fr.firestoreClient = firestoreClient

	// Execute the listeners sequentially, in case later listeners need to utilize data fetched
	// by previous listeners
	// initFns := []func(){fr.initializeCoursesListener, fr.initializeQueuesListener, fr.initializeUserProfilesListener}
	initFns := []func(){fr.initializeCoursesListener}
	for _, initFn := range initFns {
		fmt.Println("Something was initialized!")
		initFn()
	}

	return fr, nil
}
