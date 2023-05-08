package config

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

var Config *ServerConfig

// ServerConfig is a struct that contains configuration values for the server.
type ServerConfig struct {
	// AllowedOrigins is a list of URLs that the server will accept requests from.
	AllowedOrigins []string
	// AllowedEmailDomains is a list of email domains that the server will allow account registrations from. If empty,
	// all domains will be allowed.
	AllowedEmailDomains []string
	// IsHTTPS should be set to true for production.
	IsHTTPS bool
	// SessionCookieName is the name to use for the session cookie.
	SessionCookieName string
	// SessionCookieExpiration is the amount of time a session cookie is valid. Max 5 days.
	SessionCookieExpiration time.Duration
	// Port is the port the server should run on.
	Port string
	// FirebaseConfig is the JSON config for the Firebase project.
	FirebaseConfig []byte
}

func init() {
	log.Println("🙂️ No configuration provided. Using the default configuration.")
	godotenv.Load()
	Config = &ServerConfig{
		AllowedOrigins:          strings.Split(os.Getenv("ALLOWED_ORIGINS"), ","),
		AllowedEmailDomains:     strings.Split(os.Getenv("ALLOWED_EMAIL_DOMAINS"), ","),
		IsHTTPS:                 os.Getenv("IS_HTTPS") == "true",
		SessionCookieName:       "here-session",
		SessionCookieExpiration: time.Hour * 24 * 14,
		Port:                    os.Getenv("PORT"),
		FirebaseConfig:          []byte(os.Getenv("FIREBASE_CONFIG")),
	}
}
