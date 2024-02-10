package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/bocianowski1/posts/db"
	"github.com/gofiber/fiber/v2"
)

func HandleGetPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := db.GetPosts()
	if err != nil {
		writeJSON(w, err, http.StatusInternalServerError)
		return
	}

	writeJSON(w, posts, http.StatusOK)
}

func HandleGetPostsByUsername(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Path[len("/posts/"):]

	if err := userExists(username); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	posts, err := db.GetPostsByUsername(username)
	if err != nil {
		log.Println(err)
		return
	}

	jsonPosts, err := json.Marshal(posts)
	if err != nil {
		log.Println(err)
		return
	}

	writeJSON(w, jsonPosts, http.StatusOK)
}

func HandleCreatePost(c *fiber.Ctx) error {
	post := &db.Post{}

	if err := json.Unmarshal(c.Body(), post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if err := db.CreatePost(post); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create post",
		})
	}

	return c.JSON(post)
}

// func HandleGetPosts(c *fiber.Ctx) error {
// 	posts, err := db.GetPosts()
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Failed to get posts",
// 		})
// 	}

// 	return c.JSON(posts)
// }

// func HandleGetPostsByUsername(c *fiber.Ctx) error {
// 	username := c.Params("username")

// 	posts, err := db.GetPostsByUsername(username)
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Failed to get posts",
// 		})
// 	}

// 	return c.JSON(posts)
// }

// func HandleCreatePost(c *fiber.Ctx) error {
// 	post := &db.Post{}

// 	if err := json.Unmarshal(c.Body(), post); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 			"error": "Cannot parse JSON",
// 		})
// 	}

// 	if err := db.CreatePost(post); err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Failed to create post",
// 		})
// 	}

// 	return c.JSON(post)
// }
