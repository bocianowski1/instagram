package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"

	"github.com/bocianowski1/messages/db"
	"github.com/bocianowski1/messages/util"
	"github.com/gorilla/mux"
	"golang.org/x/net/websocket"
)

type Client struct {
	ID       string
	Username string
	Conn     *websocket.Conn
}

var clients = make(map[string]*Client)
var clientsLock = &sync.RWMutex{}
var messageQueue = make(chan *db.Message, 100)
var wg sync.WaitGroup
var shutdownChan = make(chan os.Signal, 1)

func main() {
	db.Init()
	r := mux.NewRouter()
	r.HandleFunc("/messages", handleGetMessages)

	// signal for graceful shutdown
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM)

	// start websocket
	r.Handle("/ws", websocket.Handler(wsHandler))

	wg.Add(1)
	go processMessages()

	go func() {
		log.Println("WebSocket server is listening on :9999")
		if err := http.ListenAndServe(":9999", r); err != nil {
			log.Fatal(err)
		}
	}()

	// Wait for shutdown signal
	<-shutdownChan

	log.Println("Shutting down...")
	close(shutdownChan)
	wg.Wait()
	log.Println("Shutdown complete")
}

func wsHandler(ws *websocket.Conn) {
	clientID := generateUniqueID()
	client := &Client{ID: clientID, Conn: ws}

	clientsLock.Lock()
	clients[clientID] = client
	clientsLock.Unlock()

	defer func() {
		clientsLock.Lock()
		delete(clients, clientID)
		clientsLock.Unlock()
	}()

	for {
		var msg string
		if err := websocket.Message.Receive(ws, &msg); err != nil {
			if err.Error() != "EOF" {
				log.Printf("Error receiving message from %s: %v\n", clientID, err)
			}
			break
		}

		parts := strings.Split(msg, "--")
		if len(parts) != 3 {
			log.Printf("Invalid message format: %s\n", msg)
			continue
		}

		client.Username = parts[0]
		msg = parts[1]
		receiver := parts[2]

		log.Println("Message received: " + msg + " from " + client.Username + " to " + receiver)

		messageQueue <- &db.Message{
			Sender:   client.Username,
			Receiver: receiver,
			Content:  msg,
		}

		broadcastMessage(clientID, client.Username, msg, receiver)
	}
}

func processMessages() {
	defer wg.Done()

	for {
		select {
		case message := <-messageQueue:
			if err := db.CreateMessage(message); err != nil {
				log.Printf("Error saving message to database: %v\n", err)
			}
		case <-shutdownChan:
			log.Println("Received shutdown signal. Exiting...")
			return
		}
	}
}

func broadcastMessage(senderID, senderUsername, msg, receiver string) {
	clientsLock.RLock()
	defer clientsLock.RUnlock()

	for _, client := range clients {
		if isWebSocketOpen(client.Conn) {
			fullMessage := fmt.Sprintf("%s--%s--%s", senderUsername, msg, receiver)
			if err := websocket.Message.Send(client.Conn, fullMessage); err != nil {
				log.Printf("Error sending message to %s: %v\n", client.ID, err)
			}
		} else {
			removeClient(client.ID)
		}
	}
}

func isWebSocketOpen(ws *websocket.Conn) bool {
	var zeroByte []byte
	err := websocket.Message.Send(ws, zeroByte)
	return err == nil
}

func generateUniqueID() string {
	id := rand.Intn(8999) + 1000
	return fmt.Sprintf("%d", id)
}

func removeClient(clientID string) {
	delete(clients, clientID)
	log.Printf("Client disconnected: %s\n", clientID)
}

func handleGetMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	user1 := r.URL.Query().Get("user1")
	user2 := r.URL.Query().Get("user2")

	if user1 == "" || user2 == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !util.ValidateUsername(user1) || !util.ValidateUsername(user2) {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	messages, err := db.GetMessages(user1, user2)
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
