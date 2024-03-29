package handlers

import (
	"log"
	"strconv"
	"strings"

	"github.com/bocianowski1/posts/db"
	"github.com/gofiber/fiber/v2"
)

func HandleLikePost(c *fiber.Ctx) error {
	var likeReq db.LikeRequest
	if err := c.BodyParser(&likeReq); err != nil {
		log.Println("Error parsing body")
		log.Println(err)
		return c.SendStatus(fiber.StatusBadRequest)
	}

	id, err := strconv.Atoi(likeReq.PostID)
	if err != nil {
		log.Println(err)
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if exists, err := db.PostExists(uint(id)); err != nil {
		log.Println("post does not exist", err)
		return c.SendStatus(fiber.StatusInternalServerError)
	} else if !exists {
		return c.SendStatus(fiber.StatusNotFound)
	}

	if err := userExists(likeReq.Username); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	action := strings.ToLower(likeReq.Action)
	if action != "like" && action != "unlike" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid action",
		})
	}

	if err := db.UpdateLike(&db.Like{
		Username: likeReq.Username,
		PostID:   uint(id),
	}, action); err != nil {
		log.Println(err)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

func GetLikesByUser(c *fiber.Ctx) error {
	username := c.Params("username")
	if err := userExists(username); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	likes, err := db.GetLikesByUser(username)
	if err != nil {
		log.Println(err)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(likes)
}
