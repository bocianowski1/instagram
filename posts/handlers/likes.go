package handlers

import (
	"log"
	"strconv"

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
		log.Println(err)
		return c.SendStatus(fiber.StatusInternalServerError)
	} else if !exists {
		return c.SendStatus(fiber.StatusNotFound)
	}

	if err := userExists(likeReq.Username); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if err := db.CreateLike(&db.Like{
		Username: likeReq.Username,
		PostID:   uint(id),
	}); err != nil {
		log.Println(err)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

func HandleUnlikePost(c *fiber.Ctx) error {
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
		log.Println(err)
		return c.SendStatus(fiber.StatusInternalServerError)
	} else if !exists {
		return c.SendStatus(fiber.StatusNotFound)
	}

	if err := userExists(likeReq.Username); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if err := db.DeleteLike(&db.Like{
		Username: likeReq.Username,
		PostID:   uint(id),
	}); err != nil {
		log.Println(err)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}
