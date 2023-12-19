package db

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string  `json:"username" gorm:"unique" validate:"required"`
	Name      string  `json:"name" validate:"required"`
	Password  string  `json:"password" validate:"required"`
	Followers []*User `gorm:"many2many:followers;"`
	Following []*User `gorm:"many2many:following;"`
}

func CreateUser(user *User) error {
	return Db.Create(user).Error
}

func GetUsers() ([]*User, error) {
	var users []*User
	err := Db.Preload("Followers").Preload("Following").Find(&users).Error
	return users, err
}

func GetUserByUsername(username string) (*User, error) {
	user := &User{}
	err := Db.Preload("Followers").Preload("Following").Where("username = ?", username).First(user).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return user, err
}

func UserExists(username string) (bool, error) {
	var count int64
	err := Db.Model(&User{}).Where("username = ?", username).Count(&count).Error
	return count > 0, err
}
