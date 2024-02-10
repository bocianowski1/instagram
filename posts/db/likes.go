package db

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type Like struct {
	gorm.Model
	Username string `json:"username" gorm:"not null"`
	PostID   uint   `json:"post_id" gorm:"not null"`
}

type LikeRequest struct {
	Username string `json:"username"`
	PostID   string `json:"postId"`
	Action   string `json:"action"`
}

func UpdateLike(like *Like, action string) error {
	tx := Db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	var post Post
	if err := tx.First(&post, like.PostID).Error; err != nil {
		tx.Rollback()
		return err
	}

	switch action {
	case "like":
		var existingLike Like
		err := tx.Where("username = ? AND post_id = ?", like.Username, like.PostID).First(&existingLike).Error
		if err == nil {
			tx.Rollback()
			return fmt.Errorf("like already exists")
		}
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			tx.Rollback()
			return err
		}
		if err := tx.Model(&post).Association("Likes").Append(like); err != nil {
			tx.Rollback()
			return err
		}

	case "unlike":
		var likeToDelete Like
		if err := tx.Where("username = ? AND post_id = ?", like.Username, like.PostID).First(&likeToDelete).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				tx.Rollback()
				return fmt.Errorf("like not found")
			}
			tx.Rollback()
			return err
		}
		if err := tx.Delete(&likeToDelete).Error; err != nil {
			tx.Rollback()
			return err
		}

	default:
		tx.Rollback()
		return fmt.Errorf("invalid action")
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func GetLikesByUser(username string) ([]Like, error) {
	var likes []Like
	if err := Db.Where("username = ?", username).Find(&likes).Error; err != nil {
		return nil, err
	}

	return likes, nil
}
