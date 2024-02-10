package handlers

import (
	"github.com/bocianowski1/auth/db"
	"github.com/gofiber/fiber/v2"
)

func HandleFollowUser(c *fiber.Ctx) error {
	username := c.Query("username")
	followingUsername := c.Query("followingUsername")

	if username == "" || followingUsername == "" {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	err := db.FollowUser(username, followingUsername)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}

func HandleUnfollowUser(c *fiber.Ctx) error {
	username := c.Query("username")
	followingUsername := c.Query("followingUsername")

	if username == "" || followingUsername == "" {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	err := db.UnfollowUser(username, followingUsername)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}
