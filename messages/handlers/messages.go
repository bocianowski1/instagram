package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/bocianowski1/messages/db"
	"github.com/bocianowski1/messages/util"
)

func HandleGetMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	user1 := r.URL.Query().Get("user1")
	user2 := r.URL.Query().Get("user2")

	if user1 == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !util.ValidateUsername(user1) || (user2 != "" && !util.ValidateUsername(user2)) {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var (
		messages []*db.Message
		err      error
	)

	if user2 == "" {
		messages, err = db.GetMessagesByUser(user1)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		messages, err = db.GetMessages(user1, user2)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	jsonMessages, err := json.Marshal(messages)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonMessages)
}

func HandleGetMessagesByUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	user := r.URL.Query().Get("user")

	if user == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !util.ValidateUsername(user) {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	messages, err := db.GetMessagesByUser(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	jsonMessages, err := json.Marshal(messages)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonMessages)
}
