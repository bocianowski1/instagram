package util

import (
	"log"
	"net/http"
	"os"
)

func ValidateUsername(username string) bool {
	log.Println("VALIDATING USERNAME")
	url := os.Getenv("AUTH_URL")
	if url == "" {
		url = "http://localhost:8080"
	}

	// we need a jwt token to validate username
	// but we don't have one
	// so we just check if the user exists

	resp, err := http.Get(url + "/users/" + username + "/exists")
	if err != nil {
		return false
	}

	if resp.StatusCode != http.StatusOK {
		log.Println(resp.StatusCode)
		return false
	}

	return true
}
