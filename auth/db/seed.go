package db

func Seed() {
	Db.Create(&User{
		Username: "admin",
		Password: "admin",
		IsAdmin:  true,
	})

	Db.Create(&User{
		Username: "guest",
		Password: "guest",
	})
}
