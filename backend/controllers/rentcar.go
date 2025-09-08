package controllers

import (
	"net/http"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/PanuAutawo/CarTentManagement/backend/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RentListController struct {
	DB *gorm.DB
}

func NewRentListController(db *gorm.DB) *RentListController {
	return &RentListController{DB: db}
}

// ---------------- RentList CRUD ----------------

// GET /rentlists
func (cc *RentListController) GetRentLists(c *gin.Context) {
	var rentlists []entity.RentList
	if err := cc.DB.Preload("Car").
		Preload("Manager").
		Preload("RentAbleDates").
		Preload("RentAbleDates.DateforRent").
		Find(&rentlists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rentlists)
}

// GET /rentlists/:id
func (cc *RentListController) GetRentListByID(c *gin.Context) {
	id := c.Param("id")
	rentID, err := utils.StringToUint(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rent list ID"})
		return
	}

	var rentlist entity.RentList
	if err := cc.DB.Preload("Car").
		Preload("Manager").
		Preload("RentAbleDates").
		Preload("RentAbleDates.DateforRent").
		First(&rentlist, rentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rent list not found"})
		return
	}

	c.JSON(http.StatusOK, rentlist)
}

// POST /rentlists
func (cc *RentListController) CreateRentList(c *gin.Context) {
	var rentlist entity.RentList
	if err := c.ShouldBindJSON(&rentlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := cc.DB.Create(&rentlist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, rentlist)
}

// PUT /rentlists/:id
func (cc *RentListController) UpdateRentList(c *gin.Context) {
	id := c.Param("id")
	rentID, err := utils.StringToUint(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rent list ID"})
		return
	}

	var rentlist entity.RentList
	if err := cc.DB.First(&rentlist, rentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rent list not found"})
		return
	}

	var input entity.RentList
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cc.DB.Model(&rentlist).Updates(input)
	c.JSON(http.StatusOK, rentlist)
}

// DELETE /rentlists/:id
func (cc *RentListController) DeleteRentList(c *gin.Context) {
	id := c.Param("id")
	rentID, err := utils.StringToUint(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rent list ID"})
		return
	}

	if err := cc.DB.Delete(&entity.RentList{}, rentID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rent list deleted"})
}

// ---------------- RentAbleDate ----------------

// POST /rentlists/:id/rentable-dates
func (cc *RentListController) AddRentAbleDate(c *gin.Context) {
	id := c.Param("id")
	rentID, err := utils.StringToUint(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rent list ID"})
		return
	}

	var input struct {
		OpenDate  time.Time `json:"open_date"`
		CloseDate time.Time `json:"close_date"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง DateforRent
	date := entity.DateforRent{
		OpenDate:  input.OpenDate,
		CloseDate: input.CloseDate,
	}

	if err := cc.DB.Create(&date).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// เชื่อม RentList กับ DateforRent
	rentAble := entity.RentAbleDate{
		RentListID:    rentID,
		DateforRentID: date.ID,
	}

	if err := cc.DB.Create(&rentAble).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"rent_able_date": rentAble})
}

// GET /rentlists/:id/rentable-dates
func (cc *RentListController) GetRentAbleDates(c *gin.Context) {
	id := c.Param("id")
	rentID, err := utils.StringToUint(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rent list ID"})
		return
	}

	var rentAbleDates []entity.RentAbleDate
	if err := cc.DB.Preload("DateforRent").
		Where("rent_list_id = ?", rentID).
		Find(&rentAbleDates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, rentAbleDates)
}
