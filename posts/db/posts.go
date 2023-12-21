package db

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Username string     `json:"username" gorm:"not null"`
	Caption  string     `json:"caption"`
	ImageURL string     `json:"image_url" gorm:"default:null"`
	Comments []*Comment `json:"comments" gorm:"foreignKey:PostID;references:ID"`
	Likes    []*Like    `json:"likes" gorm:"foreignKey:PostID;references:ID"`
}

func CreatePost(post *Post) error {
	return Db.Create(post).Error
}

func PostExists(postID uint) (bool, error) {
	var count int64
	err := Db.Model(&Post{}).Where("id = ?", postID).Count(&count).Error
	return count > 0, err
}

func GetPostsByUsername(username string) ([]*Post, error) {
	var posts []*Post
	err := Db.Where("username = ?", username).Find(&posts).Error
	return posts, err
}

func GetPosts() ([]*Post, error) {
	var posts []*Post
	err := Db.Preload("Comments").Preload("Likes").Find(&posts).Error
	return posts, err
}
