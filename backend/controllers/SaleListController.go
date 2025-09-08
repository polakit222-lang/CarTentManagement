package controllers

import (
	"net/http"
	"strconv"

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

// GET /salelists
func (slc *SaleListController) GetSaleLists(c *gin.Context) {
	var lists []entity.SaleList
	if err := slc.DB.Preload("Car").Find(&lists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lists)
}

// GET /salelists/:id
func (slc *SaleListController) GetSaleListByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var list entity.SaleList
	if err := slc.DB.Preload("Car").First(&list, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SaleList not found"})
		return
	}
	c.JSON(http.StatusOK, list)
}

// POST /salelists
func (slc *SaleListController) CreateSaleList(c *gin.Context) {
	var input entity.SaleList
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := slc.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, input)
}

// PUT /salelists/:id
func (slc *SaleListController) UpdateSaleList(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var list entity.SaleList
	if err := slc.DB.First(&list, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SaleList not found"})
		return
	}

	var input entity.SaleList
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	slc.DB.Model(&list).Updates(input)
	c.JSON(http.StatusOK, list)
}

// DELETE /salelists/:id
func (slc *SaleListController) DeleteSaleList(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := slc.DB.Delete(&entity.SaleList{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
