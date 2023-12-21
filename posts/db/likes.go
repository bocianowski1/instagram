package db

import "gorm.io/gorm"

type Like struct {
	gorm.Model
	Username string `json:"username" gorm:"not null"`
	PostID   uint   `json:"post_id" gorm:"not null"`
}

type LikeRequest struct {
	Username string `json:"username"`
	PostID   string `json:"postId"`
}

func CreateLike(like *Like) error {
	var post Post
	if err := Db.First(&post, like.PostID).Error; err != nil {
		return err
	}

	if err := Db.Model(&post).Association("Likes").Append(like); err != nil {
		return err
	}

	return nil
}

func DeleteLike(like *Like) error {
	var post Post
	if err := Db.First(&post, like.PostID).Error; err != nil {
		return err
	}

	if err := Db.Model(&post).Association("Likes").Delete(like); err != nil {
		return err
	}

	return nil
}
