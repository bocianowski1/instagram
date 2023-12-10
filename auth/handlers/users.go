package handlers

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/bocianowski1/auth/db"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func HandleLogin(c *fiber.Ctx) error {
	var loginReq db.LoginRequest
	if err := json.Unmarshal(c.Body(), &loginReq); err != nil {
		log.Println("Error unmarshalling login request", err)
		return err
	}

	username := loginReq.Username
	pass := loginReq.Password

	if username == "" || pass == "" {
		log.Println("Username or password empty")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	user, err := db.GetUserByUsername(username)
	if err != nil {
		log.Println("Error getting user", err)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if user == nil {
		log.Println("User not found")
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	if user.Password != pass {
		log.Println("Wrong password")
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	claims := jwt.MapClaims{
		"username": username,
		"admin":    user.IsAdmin,
		"exp":      time.Now().Add(time.Hour * 8).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signKey := os.Getenv("SIGNING_KEY")

	if signKey == "" {
		log.Println("SIGNING_KEY not set")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	t, err := token.SignedString([]byte(signKey))
	if err != nil {
		log.Println("Error signing token", err)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{"token": t, "user": user})
}

func HandleGetUser(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(*db.User)
	if !ok {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	return c.JSON(user)
}

func HandleGetUsers(c *fiber.Ctx) error {
	username := c.Query("username")
	if username != "" {
		return HandleGetUserByUsername(c, username)
	}
	users, err := db.GetUsers()
	if err != nil {
		return err
	}

	return c.JSON(users)
}

func HandleGetUserByUsername(c *fiber.Ctx, username string) error {
	user, err := db.GetUserByUsername(username)
	if err != nil {
		return err
	}

	return c.JSON(user)
}
