package database

import (
	"log"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	database, err := gorm.Open(sqlite.Open("car.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	// Auto migrate
	database.AutoMigrate(&entity.Brand{}, &entity.CarModel{}, &entity.SubModel{}, &entity.Detail{}, &entity.Car{})

	DB = database
}
