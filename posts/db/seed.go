package db

func Seed() {
	posts := []*Post{
		{
			Username: "admin",
			Caption:  "This is a post by admin",
		},
		{
			Username: "guest",
			Caption:  "This is a post by guest",
		},
	}

	for _, post := range posts {
		Db.Create(post)
	}
}
