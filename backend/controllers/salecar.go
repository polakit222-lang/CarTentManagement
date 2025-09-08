package controllers

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SaleListController struct {
	DB *gorm.DB
}

func NewSaleListController(db *gorm.DB) *SaleListController {
	return &SaleListController{DB: db}
}

// Base URL สำหรับรูป
const baseImageURL = "http://localhost:8080/images/cars/"

// แปลง path ของรูปเป็น full URL
func setFullImagePath(car *entity.Car) {
	if car == nil || car.Pictures == nil {
		return
	}
	for i := range car.Pictures {
		car.Pictures[i].Path = baseImageURL + car.Pictures[i].Path
	}
}

// Get all SaleList
func (ctrl *SaleListController) GetSaleLists(c *gin.Context) {
	var sales []entity.SaleList

	if err := ctrl.DB.
		Preload("Car").
		Preload("Car.Pictures").
		Preload("Manager").
		Preload("Employee").
		Preload("SalesContract").
		Find(&sales).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// แก้ path ของรูปให้เป็น full URL
	for i := range sales {
		setFullImagePath(sales[i].Car)
	}

	c.JSON(http.StatusOK, sales)
}

// Get SaleList by ID
func (ctrl *SaleListController) GetSaleListByID(c *gin.Context) {
	id := c.Param("id")
	var sale entity.SaleList

	if err := ctrl.DB.
		Preload("Car").
		Preload("Car.Pictures").
		Preload("Manager").
		Preload("Employee").
		Preload("SalesContract").
		First(&sale, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SaleList not found"})
		return
	}

	setFullImagePath(sale.Car)

	c.JSON(http.StatusOK, sale)
}

// Create new SaleList
func (ctrl *SaleListController) CreateSaleList(c *gin.Context) {
	var sale entity.SaleList

	if err := c.ShouldBindJSON(&sale); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Create(&sale).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, sale)
}

// Update SaleList by ID
func (ctrl *SaleListController) UpdateSaleList(c *gin.Context) {
	id := c.Param("id")
	var sale entity.SaleList

	if err := ctrl.DB.First(&sale, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SaleList not found"})
		return
	}

	var input entity.SaleList
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Model(&sale).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, sale)
}

// Delete SaleList by ID
func (ctrl *SaleListController) DeleteSaleList(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.SaleList{}, id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "SaleList deleted"})
}
