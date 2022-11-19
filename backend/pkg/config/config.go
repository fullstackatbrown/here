package config

import (
	"log"
	"os"
	"strconv"
	"time"
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
	Port int
	// FirebaseConfig is the path to the Firebase Admin config JSON.
	FirebaseConfig string
}

func DefaultDevelopmentConfig() *ServerConfig {
	return &ServerConfig{
		AllowedOrigins:          []string{"http://localhost:3000"},
		AllowedEmailDomains:     []string{"brown.edu", "gmail.com"},
		IsHTTPS:                 false,
		SessionCookieName:       "hours-session",
		SessionCookieExpiration: time.Hour * 24 * 14,
		Port:                    8080,
		FirebaseConfig:          "dev-firebase-config.json",
	}
}

func DefaultStagingConfig() *ServerConfig {
	return &ServerConfig{
		AllowedOrigins:          []string{"https://hours.luu.dev"},
		AllowedEmailDomains:     []string{"brown.edu"},
		IsHTTPS:                 true,
		SessionCookieName:       "hours-session",
		SessionCookieExpiration: time.Hour * 24 * 14,
		Port:                    8080,
		FirebaseConfig:          "staging-firebase-config.json",
	}
}

func DefaultProductionConfig() *ServerConfig {
	portEnvVar, err := strconv.Atoi(os.Getenv("PORT"))
	port := 8080
	if err == nil {
		port = portEnvVar
	}

	return &ServerConfig{
		AllowedOrigins:          []string{"https://hours.cs.brown.edu"},
		AllowedEmailDomains:     []string{"brown.edu"},
		IsHTTPS:                 true,
		SessionCookieName:       "hours-session",
		SessionCookieExpiration: time.Hour * 24 * 14,
		Port:                    port,
		FirebaseConfig:          "prod-firebase-config.json",
	}
}

func init() {
	log.Println("🙂️ No configuration provided. Using the default configuration.")
	Config = DefaultDevelopmentConfig()
}
