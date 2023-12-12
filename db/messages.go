package db

import (
	"fmt"

	"github.com/bocianowski1/messages/util"
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	Sender   string `json:"sender" validate:"required"`
	Receiver string `json:"receiver" validate:"required"`
	Content  string `json:"content" validate:"required"`
}

func CreateMessage(message *Message) error {
	if message.Sender == message.Receiver {
		return fmt.Errorf(util.SENDER_RECEIVER_SAME)
	}

	if message.Content == "" {
		return fmt.Errorf(util.EMPTY_MESSAGE)
	}

	if !util.ValidateUsername(message.Sender) || !util.ValidateUsername(message.Receiver) {
		return fmt.Errorf(util.INVALID_USERNAME)
	}

	if err := Db.Create(message).Error; err != nil {
		return err
	}
	return nil
}
