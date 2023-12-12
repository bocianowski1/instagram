package main

import (
	"log"
	"net/http"

	"github.com/bocianowski1/messages/db"
	"golang.org/x/net/websocket"
)

func main() {
	db.Init()

	http.HandleFunc("/ws", func(w http.ResponseWriter, req *http.Request) {
		s := websocket.Server{Handler: websocket.Handler(wsHandler)}
		s.ServeHTTP(w, req)
	})

	log.Println("WebSocket server is listening on :9999")
	log.Fatal(http.ListenAndServe(":9999", nil))
}
