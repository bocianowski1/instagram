package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow connections from any origin during development
		return true
	},
}

func handleMessages(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			return
		}

		fmt.Println(string(p))

		// print the sender
		fmt.Println("Message received from:", conn.RemoteAddr())

		// Handle the received message (e.g., store it in the database)
		// ...

		// Send a response (if needed)
		if err := conn.WriteMessage(messageType, p); err != nil {
			fmt.Println(err)
			return
		}
	}
}

func main() {
	log.Println("Starting server on :9999")

	// Use handlers.CORS to enable CORS
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}),
		handlers.AllowCredentials(),
	)(http.HandlerFunc(handleMessages))

	http.Handle("/ws", corsHandler)

	log.Fatal(http.ListenAndServe(":9999", nil))
}
