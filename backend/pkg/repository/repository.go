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

	// map from valid course entry codes to courseID
	coursesEntryCodesLock *sync.RWMutex
	coursesEntryCodes     map[string]string

	sectionsLock *sync.RWMutex
	sections     map[string]*models.Section

	assignmentsLock *sync.RWMutex
	assignments     map[string]*models.Assignment

	surveysLock *sync.RWMutex
	surveys     map[string]*models.Survey

	profilesLock *sync.RWMutex
	profiles     map[string]*models.Profile
}

func NewFirebaseRepository() (*FirebaseRepository, error) {
	fr := &FirebaseRepository{
		coursesLock:           &sync.RWMutex{},
		courses:               make(map[string]*models.Course),
		coursesEntryCodesLock: &sync.RWMutex{},
		coursesEntryCodes:     make(map[string]string),
		sectionsLock:          &sync.RWMutex{},
		sections:              make(map[string]*models.Section),
		assignmentsLock:       &sync.RWMutex{},
		assignments:           make(map[string]*models.Assignment),
		surveysLock:           &sync.RWMutex{},
		surveys:               make(map[string]*models.Survey),
		profilesLock:          &sync.RWMutex{},
		profiles:              make(map[string]*models.Profile),
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
	initFns := []func(){fr.initializeCoursesListener, fr.initializeSectionsListener, fr.initializeAssignmentsListener, fr.initializeSurveysListener, fr.initializeProfilesListener}
	for _, initFn := range initFns {
		initFn()
	}

	return fr, nil
}
