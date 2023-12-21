package handlers

import (
	"log"
	"net/http"
	"os"
)

func userExists(username string) error {
	url := os.Getenv("AUTH_URL")
	if url == "" {
		log.Println("AUTH_URL not set, using default")
		url = "http://localhost:8080"
	}

	resp, err := http.Get(url + "/users/" + username + "/exists")
	if err != nil {
		log.Println(err)
		return err
	}

	if resp.StatusCode != http.StatusOK {
		log.Println("User does not exist", resp.StatusCode)
		return err
	}

	return nil
}
