package handlers

import (
	"encoding/json"

	"github.com/bocianowski1/posts/db"
	"github.com/gofiber/fiber/v2"
)

func HandleGetPosts(c *fiber.Ctx) error {
	posts, err := db.GetPosts()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get posts",
		})
	}

	return c.JSON(posts)
}

func HandleGetPostsByUsername(c *fiber.Ctx) error {
	username := c.Params("username")

	posts, err := db.GetPostsByUsername(username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get posts",
		})
	}

	return c.JSON(posts)
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
