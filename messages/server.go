package main

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"sync"

	"golang.org/x/net/websocket"
)

type Client struct {
	ID       string
	Username string
	Conn     *websocket.Conn
}

var clients = make(map[string]*Client)
var clientsLock = &sync.RWMutex{}

func wsHandler(ws *websocket.Conn) {
	clientID := generateUniqueID()
	client := &Client{ID: clientID, Conn: ws}

	clientsLock.Lock()
	clients[clientID] = client
	clientsLock.Unlock()

	for {
		var msg string
		if err := websocket.Message.Receive(ws, &msg); err != nil {
			if err.Error() != "EOF" {
				log.Printf("Error receiving message from %s: %v\n", clientID, err)
			}
			break
		}

		// Extract username from the message (format is "sender--message--receiver")
		parts := strings.Split(msg, "--")
		if len(parts) != 3 {
			log.Printf("Invalid message format: %s\n", msg)
			continue
		}

		client.Username = parts[0]
		msg = parts[1]
		receiver := parts[2]

		log.Println("Message received: " + msg + " from " + client.Username + " to " + receiver)

		// Broadcast the message to all connected clients
		broadcastMessage(clientID, client.Username, msg, receiver)
	}
}

func broadcastMessage(senderID, senderUsername, msg, receiver string) {
	clientsLock.Lock()
	defer clientsLock.Unlock()

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
	// 1000 - 9999
	id := rand.Intn(8999) + 1000
	return fmt.Sprintf("%d", id)
}

func removeClient(clientID string) {
	delete(clients, clientID)
	log.Printf("Client disconnected: %s\n", clientID)
}
