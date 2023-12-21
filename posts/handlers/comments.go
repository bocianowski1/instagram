package handlers

import (
	"encoding/json"
	"log"
	"strconv"

	"github.com/bocianowski1/posts/db"
	"github.com/gofiber/fiber/v2"
)

func HandleCreateComment(c *fiber.Ctx) error {
	commentReq := &db.CommentRequest{}

	if err := json.Unmarshal(c.Body(), commentReq); err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	id, err := strconv.Atoi(commentReq.PostID)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if exists, err := db.PostExists(uint(id)); err != nil {
		log.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check if post exists",
		})
	} else if !exists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post does not exist",
		})
	}

	// GET request to users service to check if user exists
	// localhost:8080/users/:username/exists
	if err := userExists(commentReq.Username); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check if user exists",
		})
	}

	comment := &db.Comment{
		PostID:   uint(id),
		Username: commentReq.Username,
		Content:  commentReq.Content,
	}

	if err := db.CreateComment(comment); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create comment",
		})
	}

	return c.JSON(comment)
}
