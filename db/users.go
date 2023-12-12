package db

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique" validate:"required"`
	Password string `json:"password" validate:"required"`
	IsAdmin  bool   `json:"is_admin" gorm:"default:false"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func CreateUser(user *User) error {
	return Db.Create(user).Error
}

func GetUsers() ([]*User, error) {
	var users []*User
	err := Db.Find(&users).Error
	return users, err
}

func GetUserByUsername(username string) (*User, error) {
	user := &User{}
	err := Db.Where("username = ?", username).First(user).Error
	return user, err
}
