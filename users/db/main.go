package db

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB

func Init() {
	db, err := gorm.Open(postgres.Open(os.Getenv("DB_URL")), &gorm.Config{
		// Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Println("Failed to connect to database")
		log.Fatal(err)
		os.Exit(2)
	}

	log.Println("Connected to database")
	// db.Logger = db.Logger.LogMode(logger.Info)

	db.Exec("DROP TABLE IF EXISTS users CASCADE")
	db.Exec("DROP TABLE IF EXISTS sessions CASCADE")
	db.Exec("DROP TABLE IF EXISTS followers CASCADE")
	db.Exec("DROP TABLE IF EXISTS following CASCADE")

	log.Println("Migrating the schema...")
	db.AutoMigrate(&User{}, &Session{})

	Db = db

	Seed()
}
