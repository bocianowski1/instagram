package main

import (
	"log"
	"os"

	"github.com/bocianowski1/auth/db"
	"github.com/bocianowski1/auth/handlers"
	"github.com/bocianowski1/auth/middleware"

	"github.com/gofiber/fiber/v2"
)

func main() {
	db.Init()

	app := fiber.New()
	Routes(app)

	log.Fatal(app.Listen(":8080"))
}

func Routes(app *fiber.App) {
	app.Post("/auth/login", handlers.HandleLogin)

	// sessions
	app.Get("/sessions", handlers.HandleGetSessionByID)
	app.Post("/sessions", handlers.HandlePostSession)
	app.Delete("/sessions", handlers.HandleDeleteSession)

	// JWT Middleware
	jwt := middleware.NewAuthMiddleware(os.Getenv("SIGNING_KEY"))

	// users
	app.Get("/users", jwt, handlers.HandleGetUsers)
}
