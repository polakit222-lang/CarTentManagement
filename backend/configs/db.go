package configs

import (
	"log"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase(dbName string) {
	database, err := gorm.Open(sqlite.Open(dbName), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	// AutoMigrate all tables
	err = database.AutoMigrate(
		&entity.Manager{},
		&entity.Employee{},
		&entity.Province{},
		&entity.Brand{},
		&entity.CarModel{},
		&entity.SubModel{},
		&entity.Detail{},
		&entity.Car{},
		&entity.CarPicture{},
		&entity.SaleList{},
		&entity.RentList{},
		&entity.DateforRent{},
		&entity.RentAbleDate{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = database
	log.Println("Database connected and migrated")
}
