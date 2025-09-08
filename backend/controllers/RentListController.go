package controllers

import (
	"net/http"
	"strconv"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RentListController struct {
	DB *gorm.DB
}

func NewRentListController(db *gorm.DB) *RentListController {
	return &RentListController{DB: db}
}

// GET /rentlists
func (rlc *RentListController) GetRentLists(c *gin.Context) {
	var lists []entity.RentList
	if err := rlc.DB.Preload("Car").Preload("RentAbleDates").Find(&lists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lists)
}

// GET /rentlists/:id
func (rlc *RentListController) GetRentListByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var list entity.RentList
	if err := rlc.DB.Preload("Car").Preload("RentAbleDates").First(&list, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RentList not found"})
		return
	}
	c.JSON(http.StatusOK, list)
}

// POST /rentlists
func (rlc *RentListController) CreateRentList(c *gin.Context) {
	var input entity.RentList
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := rlc.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, input)
}

// PUT /rentlists/:id
func (rlc *RentListController) UpdateRentList(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var list entity.RentList
	if err := rlc.DB.First(&list, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RentList not found"})
		return
	}

	var input entity.RentList
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rlc.DB.Model(&list).Updates(input)
	c.JSON(http.StatusOK, list)
}

// DELETE /rentlists/:id
func (rlc *RentListController) DeleteRentList(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := rlc.DB.Delete(&entity.RentList{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

// POST /rentlists/:id/rentable-dates
func (rlc *RentListController) AddRentAbleDate(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var input entity.RentAbleDate
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.RentListID = uint(id)
	if err := rlc.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, input)
}

// GET /rentlists/:id/rentable-dates
func (rlc *RentListController) GetRentAbleDates(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var dates []entity.RentAbleDate
	if err := rlc.DB.Where("rent_list_id = ?", id).Find(&dates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, dates)
}
