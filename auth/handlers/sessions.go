package handlers

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/bocianowski1/auth/db"
	"github.com/bocianowski1/auth/util"
	"github.com/gofiber/fiber/v2"
)

type SessionResponse struct {
	User    *db.User    `json:"user"`
	Session *db.Session `json:"session"`
	Error   error       `json:"error"`
}

func HandleGetSessionByID(c *fiber.Ctx) error {
	var username = c.Query("username")
	if username == "" {
		log.Println("ID empty")
		return c.SendStatus(fiber.StatusBadRequest)
	}
	user, session, err := db.GetSessionByUsername(username)
	if err != nil {
		if err.Error() == util.NOT_FOUND {
			return c.Status(fiber.StatusNotFound).JSON(SessionResponse{
				User:    nil,
				Session: nil,
				Error:   err,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(SessionResponse{
			User:    nil,
			Session: nil,
			Error:   err,
		})
	}

	return c.JSON(SessionResponse{
		User:    user,
		Session: session,
		Error:   nil,
	})
}

func HandlePostSession(c *fiber.Ctx) error {
	var sessionReq db.Session
	if err := json.Unmarshal(c.Body(), &sessionReq); err != nil {
		log.Println("Error unmarshalling session", err)
		return err
	}

	if err := validateSession(&sessionReq, true); err != nil {
		switch err.Error() {
		case util.EMPTY_USERNAME:
			return c.SendStatus(fiber.StatusBadRequest)
		case util.INVALID_SESSION:
			return c.SendStatus(fiber.StatusConflict)
		default:
			return c.SendStatus(fiber.StatusInternalServerError)
		}
	}

	user, session, err := db.CreateSession(&sessionReq)
	if err != nil {
		log.Println("Error creating session", err)
		return c.Status(fiber.StatusBadRequest).JSON(SessionResponse{
			User:    nil,
			Session: nil,
			Error:   err,
		})
	}

	return c.JSON(fiber.Map{
		"user":    user,
		"session": session,
		"error":   nil,
	})
}

func HandleDeleteSession(c *fiber.Ctx) error {
	var sessionReq db.Session
	if err := json.Unmarshal(c.Body(), &sessionReq); err != nil {
		log.Println("Error unmarshalling session", err)
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if err := validateSession(&sessionReq, false); err != nil {
		switch err.Error() {
		case util.EMPTY_USERNAME:
			return c.SendStatus(fiber.StatusBadRequest)
		case util.INVALID_SESSION:
			return c.SendStatus(fiber.StatusConflict)
		case util.NOT_FOUND:
			{
				log.Println("Session not found DELETE")
				return c.SendStatus(fiber.StatusNotFound)
			}
		default:
			return c.SendStatus(fiber.StatusInternalServerError)
		}
	}

	if err := db.DeleteSessionByUsername(sessionReq.Username); err != nil {
		log.Println("Error deleting session", err)
		return c.JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusOK)
}

func validateSession(session *db.Session, isNewSess bool) error {
	if session.Username == "" {
		return fmt.Errorf(util.EMPTY_USERNAME)
	}

	user, err := db.GetUserByUsername(session.Username)
	if err != nil {
		return err
	}

	if user == nil {
		return fmt.Errorf(util.NOT_FOUND)
	}

	if !isNewSess {
		_, _, err = db.GetSessionByUsername(session.Username)
		if err != nil {
			if err.Error() == util.NOT_FOUND {
				return err
			}
			log.Println("Session already exists", err)
			return fmt.Errorf(util.INVALID_SESSION)
		}
	}
	return nil
}
