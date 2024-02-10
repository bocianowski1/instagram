package db

import (
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	PostID   uint   `json:"postId" gorm:"not null"`
	Username string `json:"username" gorm:"not null"`
	Content  string `json:"content" gorm:"not null"`
}

type CommentRequest struct {
	PostID   string `json:"postId"`
	Username string `json:"username"`
	Content  string `json:"content"`
}

func CreateComment(comment *Comment) error {
	var post Post
	if err := Db.First(&post, comment.PostID).Error; err != nil {
		return err
	}

	if err := Db.Model(&post).Association("Comments").Append(comment); err != nil {
		return err
	}

	return nil
}

func GetCommentsByUser(username string) ([]*Comment, error) {
	var comments []*Comment
	if err := Db.Where("username = ?", username).Find(&comments).Error; err != nil {
		return nil, err
	}

	return comments, nil
}
