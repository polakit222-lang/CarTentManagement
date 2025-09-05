package controllers

import (
	"net/http"

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

func (ctrl *CarController) GetCars(c *gin.Context) {
	var cars []entity.Car

	// Preload Detail, Brand, Model, SubModel, Province และ Pictures
	if err := ctrl.DB.
		Preload("Detail").
		Preload("Detail.Brand").
		Preload("Detail.CarModel").
		Preload("Detail.SubModel").
		Preload("Province").
		Preload("Pictures"). // <- โหลดรูปภาพด้วย
		Find(&cars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cars)
}

// GetCarByID ดึงรถทีละคัน
func (cc *CarController) GetCarByID(c *gin.Context) {
	id := c.Param("id")
	var car entity.Car
	if err := cc.DB.Preload("Detail").
		Preload("Detail.Brand").
		Preload("Detail.CarModel").
		Preload("Detail.SubModel").
		Preload("Province").
		Preload("Pictures").
		First(&car, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
		return
	}
	c.JSON(http.StatusOK, car)
}

// CreateCar เพิ่มรถใหม่
func (cc *CarController) CreateCar(c *gin.Context) {
	var car entity.Car
	if err := c.ShouldBindJSON(&car); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cc.DB.Create(&car)
	c.JSON(http.StatusCreated, car)
}

// UpdateCar แก้ไขรถ
func (cc *CarController) UpdateCar(c *gin.Context) {
	id := c.Param("id")
	var car entity.Car
	if err := cc.DB.First(&car, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
		return
	}

	var input entity.Car
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cc.DB.Model(&car).Updates(input)
	c.JSON(http.StatusOK, car)
}

// DeleteCar ลบรถ
func (cc *CarController) DeleteCar(c *gin.Context) {
	id := c.Param("id")
	if err := cc.DB.Delete(&entity.Car{}, id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Car deleted"})
}
