package main

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity" // ปรับ path ตาม project ของคุณ
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("CarTent.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto migrate
	db.AutoMigrate(&entity.Car{}, &entity.CarPicture{}, &entity.Province{}, &entity.Employee{})

	r := gin.Default()

	r.GET("/cars", func(c *gin.Context) {
		var cars []entity.Car
		// Preload ข้อมูล relation
		if err := db.Preload("Pictures").
			Preload("Province").
			Preload("Employee").
			Find(&cars).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, cars)
	})

	r.Run(":8080")
}
