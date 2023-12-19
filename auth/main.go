package main

import (
	"log"
	"os"

	"github.com/bocianowski1/auth/db"
	"github.com/bocianowski1/auth/handlers"
	"github.com/bocianowski1/auth/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	db.Init()

	app := fiber.New()
	app.Use(cors.New(
		cors.Config{
			AllowOrigins: os.Getenv("CLIENT_URL"),
			AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		},
	))
	Routes(app)

	log.Fatal(app.Listen(":8080"))
}

func Routes(app *fiber.App) {
	// auth
	app.Post("/auth/login", handlers.HandleLogin)
	app.Post("/auth/register", handlers.HandleRegister)

	// sessions
	app.Get("/sessions", handlers.HandleGetSessionByID)
	app.Post("/sessions", handlers.HandlePostSession)
	app.Delete("/sessions", handlers.HandleDeleteSession)

	app.Get("/users/:username/exists", handlers.HandleUserExistsUnprotected)

	// JWT Middleware
	jwt := middleware.NewAuthMiddleware(os.Getenv("SIGNING_KEY"))

	// users
	app.Get("/users", jwt, handlers.HandleGetUsers)
	app.Get("/users/:username", jwt, handlers.HandleGetUserByUsername)

	// follow
	app.Post("/follow", jwt, handlers.HandleFollowUser)
	app.Delete("/follow", jwt, handlers.HandleUnfollowUser)
}
