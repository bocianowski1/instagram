package db

import "log"

type Activity struct {
	PostID    uint   `json:"postId"`
	LikedBy   string `json:"likedBy"`
	CommentBy string `json:"commentBy"`
	Comment   string `json:"comment"`
}

func GetActivity(username string) ([]Activity, error) {
	var activities []Activity

	err := Db.Table("posts").
		Select("posts.id as post_id, likes.username as liked_by, comments.username as comment_by, comments.content").
		Joins("left join likes on likes.post_id = posts.id").
		Joins("left join comments on comments.post_id = posts.id").
		Where("posts.username = ?", username).
		Order("likes.created_at desc, comments.created_at desc").
		Limit(100).
		Scan(&activities).Error

	if err != nil {
		log.Println("Failed to get activity")
		return nil, err
	}

	return activities, nil
}
