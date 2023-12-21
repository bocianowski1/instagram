package main

import (
	"log"

	"github.com/bocianowski1/posts/db"
	"github.com/bocianowski1/posts/handlers"

	"github.com/gofiber/fiber/v2"
)

func main() {
	db.Init()

	app := fiber.New()

	routes(app)

	log.Fatal(app.Listen(":7979"))
}

func routes(app *fiber.App) {
	// posts
	app.Get("/posts", handlers.HandleGetPosts)
	app.Get("/posts/:username", handlers.HandleGetPostsByUsername)
	app.Post("/posts", handlers.HandleCreatePost)

	// comments
	app.Post("/comments", handlers.HandleCreateComment)

	// likes
	app.Post("/likes", handlers.HandleLikePost)
	app.Delete("/likes", handlers.HandleUnlikePost)
}
