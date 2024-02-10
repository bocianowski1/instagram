package util

import (
	"log"
	"net/http"
	"os"
)

func ValidateUsername(username string) bool {
	url := os.Getenv("USERS_URL")

	if url == "" {
		log.Println("USERS_URL not set")
		return false
	}
	resp, err := http.Get(url + "/users/" + username + "/exists")
	if err != nil {
		return false
	}

	if resp.StatusCode != http.StatusOK {
		return false
	}

	return true
}
