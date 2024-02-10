package db

import "log"

func Seed() {
	admin := &User{
		Username:  "admin",
		Name:      "Addy",
		Password:  "admin",
		Followers: []*User{},
		Following: []*User{},
	}
	guest := &User{
		Username:  "guest",
		Name:      "Gus",
		Password:  "guest",
		Followers: []*User{},
		Following: []*User{},
	}
	Db.Create(admin)
	Db.Create(guest)
	log.Println("Seeded the database")
}
