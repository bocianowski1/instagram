package main

import (
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/bocianowski1/posts/db"
	"github.com/bocianowski1/posts/handlers"
	"github.com/gorilla/mux"

	"golang.org/x/net/websocket"
)

type Server struct {
	Clients map[string]*Client
	Lock    *sync.RWMutex
	// MessageQueue chan *db.Message
	Wg           sync.WaitGroup
	ShutdownChan chan os.Signal
}

type Client struct {
	ID       string
	Username string
	Conn     *websocket.Conn
}

func NewServer() *Server {
	return &Server{
		Clients: make(map[string]*Client),
		Lock:    &sync.RWMutex{},
		// MessageQueue: make(chan *db.Message, 100),
		Wg:           sync.WaitGroup{},
		ShutdownChan: make(chan os.Signal, 1),
	}
}

func main() {
	db.Init()

	s := NewServer()
	r := mux.NewRouter()

	// cors (allow localhost:3000)
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
			next.ServeHTTP(w, r)
		})
	})

	routes(r)

	s.Wg.Add(1)
	// go s.processMessages()

	go func() {
		log.Println("WebSocket server is listening on :9999")
		if err := http.ListenAndServe(":9999", r); err != nil {
			log.Fatal(err)
		}
	}()

	// Wait for shutdown signal
	<-s.ShutdownChan

	log.Println("Shutting down...")
	close(s.ShutdownChan)
	s.Wg.Wait()
	log.Println("Shutdown complete")
}

func routes(r *mux.Router) {
	// posts
	r.HandleFunc("/posts", handlers.HandleGetPosts).Methods(http.MethodGet)
	r.HandleFunc("/posts/{username}", handlers.HandleGetPostsByUsername).Methods(http.MethodGet)
	// r.HandleFunc("/posts", handlers.HandleCreatePost).Methods(http.MethodPost)

	// // activity
	// r.HandleFunc("/activity/{username}", handlers.HandleGetActivity).Methods(http.MethodGet)

	// // comments
	// r.HandleFunc("/comments", handlers.HandleCreateComment).Methods(http.MethodPost)
	// r.HandleFunc("/comments/{username}", handlers.HandleGetCommentsByUser).Methods(http.MethodGet)

	// // likes
	// r.HandleFunc("/likes", handlers.HandleLikePost).Methods(http.MethodPost)
	// r.HandleFunc("/likes/{username}", handlers.GetLikesByUser).Methods(http.MethodGet)

}


func (s *Server) WebSocket(ws *websocket.Conn) {
	clientID := generateUniqueID()
	client := &Client{ID: clientID, Conn: ws}

	s.Lock.Lock()
	s.Clients[clientID] = client
	s.Lock.Unlock()

	defer func() {
		s.Lock.Lock()
		delete(s.Clients, clientID)
		s.Lock.Unlock()
	}()

	for {
		var stringMessage string
		if err := websocket.Message.Receive(ws, &stringMessage); err != nil {
			if err.Error() != "EOF" {
				log.Printf("Error receiving message from %s: %v\n", clientID, err)
			}
			break
		}

		msg, err := db.ParseMessage(stringMessage)
		if err != nil {
			log.Printf("Error parsing message from %s: %v\n", clientID, err)
			continue
		}

		s.MessageQueue <- msg

		s.broadcastMessage(msg)
	}
}

func (s *Server) processMessages() {
	defer s.Wg.Done()

	for {
		select {
		case message := <-s.MessageQueue:
			if err := db.CreateMessage(message); err != nil {
				log.Printf("Error saving message to database: %v\n", err)
			}
		case <-s.ShutdownChan:
			log.Println("Received shutdown signal. Exiting...")
			return
		}
	}
}

func (s *Server) broadcastMessage(msg *db.Message) {
	s.Lock.RLock()
	defer s.Lock.RUnlock()

	for _, client := range s.Clients {
		if isWebSocketOpen(client.Conn) {
			fullMessage := fmt.Sprintf(`{"sender":"%s","receiver":"%s","content":"%s"}`, msg.Sender, msg.Receiver, msg.Content)
			if err := websocket.Message.Send(client.Conn, fullMessage); err != nil {
				log.Printf("Error sending message to %s: %v\n", client.ID, err)
			}
		} else {
			delete(s.Clients, client.ID)
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


// func main() {
// 	db.Init()

// 	app := fiber.New()

// 	routes(app)

// 	log.Fatal(app.Listen(":7979"))
// }

// func routes(app *fiber.App) {
// 	// posts
// 	app.Get("/posts", handlers.HandleGetPosts)
// 	app.Get("/posts/:username", handlers.HandleGetPostsByUsername)
// 	app.Post("/posts", handlers.HandleCreatePost)

// 	// activity
// 	app.Get("/activity/:username", handlers.HandleGetActivity)

// 	app.Use(limiter.New(limiter.Config{
// 		Max:               10,
// 		Expiration:        30 * time.Second,
// 		LimiterMiddleware: limiter.SlidingWindow{},
// 	}))

// 	// comments
// 	app.Post("/comments", handlers.HandleCreateComment)
// 	app.Get("/comments/:username", handlers.HandleGetCommentsByUser)

// 	// likes
// 	app.Post("/likes", handlers.HandleLikePost)
// 	app.Get("/likes/:username", handlers.GetLikesByUser)
// }
