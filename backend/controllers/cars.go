package controllers

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CarController struct {
	DB *gorm.DB
}

func NewCarController(db *gorm.DB) *CarController {
	return &CarController{DB: db}
}

// GetCars ดึงรถทั้งหมด พร้อม Detail และ Pictures
func (cc *CarController) GetCars(c *gin.Context) {
	var cars []entity.Car

	if err := cc.DB.
		Preload("Detail").
		Preload("Detail.Brand").
		Preload("Detail.CarModel").
		Preload("Detail.SubModel").
		Preload("Province").
		Preload("Pictures").
		Find(&cars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ปรับ Path รูปให้เป็น URL เต็ม
	host := c.Request.Host
	for i := range cars {
		for j := range cars[i].Pictures {
			filename := filepath.Base(cars[i].Pictures[j].Path) // เอาเฉพาะชื่อไฟล์
			cars[i].Pictures[j].Path = fmt.Sprintf("http://%s/images/cars/%s", host, filename)
		}
	}

	c.JSON(http.StatusOK, cars)
}

// GetCarByID ดึงรถทีละคัน พร้อม Detail และ Pictures
func (cc *CarController) GetCarByID(c *gin.Context) {
	id := c.Param("id")
	var car entity.Car

	if err := cc.DB.
		Preload("Detail").
		Preload("Detail.Brand").
		Preload("Detail.CarModel").
		Preload("Detail.SubModel").
		Preload("Province").
		Preload("Pictures").
		First(&car, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
		return
	}

	// ปรับ Path รูปให้เป็น URL เต็ม
	host := c.Request.Host
	for i := range car.Pictures {
		filename := filepath.Base(car.Pictures[i].Path)
		car.Pictures[i].Path = fmt.Sprintf("http://%s/images/cars/%s", host, filename)
	}
}
