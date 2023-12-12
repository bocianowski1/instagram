package db

import (
	"fmt"
	"log"
	"time"

	"github.com/bocianowski1/auth/util"
	"gorm.io/gorm"
)

type Session struct {
	gorm.Model
	Token     string    `json:"token" validate:"required"`
	Username  string    `json:"username" validate:"required"`
	ExpiresAt time.Time `json:"expires_at" gorm:"default:null"`
}

const SESSION_EXPIRES = 24 * 60 * 60 // 1 day (in seconds)

func CreateSession(session *Session) (*User, *Session, error) {
	session.ExpiresAt = time.Now().Add(time.Second * SESSION_EXPIRES)
	if err := Db.Create(session).Error; err != nil {
		return nil, nil, err
	}
	user, err := GetUserByUsername(session.Username)
	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}

func GetSessionByUsername(username string) (*User, *Session, error) {
	session := &Session{}
	if err := Db.Where("username = ?", username).First(session).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil, fmt.Errorf(util.NOT_FOUND)
		}
		log.Println("Error:", err)
		return nil, nil, err
	}

	user, err := GetUserByUsername(username)
	if err != nil {
		log.Println("Error in get session by username: ", err)
		return nil, nil, err
	}
	return user, session, nil
}

func DeleteSessionByUsername(username string) error {
	_, _, err := GetSessionByUsername(username)
	if err != nil {
		if err.Error() == util.NOT_FOUND {
			return nil
		}
		return err
	}

	if err := Db.Where("username = ?", username).Delete(&Session{}).Error; err != nil {
		log.Println("Error in delete session by username: ", err)
		return err
	}

	return nil
}
