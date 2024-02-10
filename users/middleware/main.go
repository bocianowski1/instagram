package middleware

import (
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

func NewAuthMiddleware(secret string) fiber.Handler {
	var signKey jwtware.SigningKey
	signKey.Key = []byte(secret)
	return jwtware.New(jwtware.Config{
		SigningKey: signKey,
	})
}
