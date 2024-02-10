package handlers

import (
	"github.com/bocianowski1/auth/db"
	"github.com/gofiber/fiber/v2"
)

func HandleGetUsers(c *fiber.Ctx) error {
	users, err := db.GetUsers()
	if err != nil {
		return err
	}

	return c.JSON(users)
}

func HandleGetUserByUsername(c *fiber.Ctx) error {
	username := c.Params("username")
	user, err := db.GetUserByUsername(username)
	if err != nil {
		return err
	}

	return c.JSON(user)
}

func HandleUserExistsUnprotected(c *fiber.Ctx) error {
	username := c.Params("username")
	exists, err := db.UserExists(username)
	if err != nil {
		return err
	}

	if !exists {
		return c.SendStatus(fiber.StatusNotFound)
	}

	return c.SendStatus(fiber.StatusOK)
}
