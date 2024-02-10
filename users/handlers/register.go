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

type RegisterRequest struct {
	Username string `json:"username"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

func HandleRegister(c *fiber.Ctx) error {
	var registerReq RegisterRequest
	if err := json.Unmarshal(c.Body(), &registerReq); err != nil {
		log.Println("Error unmarshalling register request", err)
		return err
	}

	username := registerReq.Username
	name := registerReq.Name
	pass := registerReq.Password

	if username == "" || pass == "" || name == "" {
		log.Println("Username, name or password empty")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	user, err := db.GetUserByUsername(username)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if user != nil {
		log.Println("User already exists")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	user = &db.User{
		Username: username,
		Name:     name,
		Password: pass,
	}

	if err := db.CreateUser(user); err != nil {
		log.Println("Error creating user", err)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	claims := jwt.MapClaims{
		"username": username,
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
