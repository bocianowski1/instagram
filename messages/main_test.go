// main_test.go

package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/websocket"
)

func TestWebSocketHandling(t *testing.T) {
	// Create a test server
	server := httptest.NewServer(http.HandlerFunc(handleMessages))
	defer server.Close()

	// Convert the test server URL to a WebSocket URL
	wsURL := "ws" + server.URL[4:]

	// Connect to the WebSocket server
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Error connecting to WebSocket: %v", err)
	}
	defer conn.Close()

	// Send a test message
	testMessage := "Hello, WebSocket!"
	err = conn.WriteMessage(websocket.TextMessage, []byte(testMessage))
	if err != nil {
		t.Fatalf("Error writing message to WebSocket: %v", err)
	}

	// Read the response from the WebSocket
	_, p, err := conn.ReadMessage()
	if err != nil {
		t.Fatalf("Error reading message from WebSocket: %v", err)
	}

	// Verify that the received message matches the sent message
	receivedMessage := string(p)
	if receivedMessage != testMessage {
		t.Errorf("Expected message: %s, Received message: %s", testMessage, receivedMessage)
	}
}
