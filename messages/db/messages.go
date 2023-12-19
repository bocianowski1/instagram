package db

import (
	"encoding/json"
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

func GetMessages(sender, receiver string) ([]*Message, error) {
	var messages []*Message
	if err := Db.Where("sender = ? AND receiver = ?", sender, receiver).Or("sender = ? AND receiver = ?", receiver, sender).Find(&messages).Error; err != nil {
		return nil, err
	}
	return messages, nil
}

func GetMessagesByUser(user string) ([]*Message, error) {
	var messages []*Message
	if err := Db.Where("sender = ? OR receiver = ?", user, user).Find(&messages).Error; err != nil {
		return nil, err
	}
	return messages, nil
}

func ParseMessage(message string) (*Message, error) {
	var msg Message
	if err := json.Unmarshal([]byte(message), &msg); err != nil {
		return nil, err
	}
	return &msg, nil
}
