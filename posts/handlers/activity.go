package handlers

import (
	"github.com/bocianowski1/posts/db"
	"github.com/gofiber/fiber/v2"
)

func HandleGetActivity(c *fiber.Ctx) error {
	username := c.Params("username")
	if err := userExists(username); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	activity, err := db.GetActivity(username)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(activity)
}
