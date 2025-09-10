package controllers

import (
	"net/http"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RentListController struct {
	DB *gorm.DB
}

// Constructor
func NewRentListController(db *gorm.DB) *RentListController {
	return &RentListController{DB: db}
}

// CreateRentList - POST /api/rentlists
func (c *RentListController) CreateRentList(ctx *gin.Context) {
	type RentPeriod struct {
		StartDate string  `json:"start_date"` // "2025-09-10"
		EndDate   string  `json:"end_date"`
		Price     float64 `json:"price"`
	}

	type RentListRequest struct {
		CarID     uint         `json:"car_id"`
		Status    string       `json:"status"`
		RentPrice float64      `json:"rent_price"` // default price
		ManagerID uint         `json:"manager_id"`
		Periods   []RentPeriod `json:"periods"` // หลายช่วงเวลา
	}

	var req RentListRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง RentList ใหม่
	rentList := entity.RentList{
		CarID:     req.CarID,
		Status:    req.Status,
		RentPrice: req.RentPrice,
		ManagerID: req.ManagerID,
	}

	if err := c.DB.Create(&rentList).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// เพิ่มแต่ละช่วงเวลา
	for _, p := range req.Periods {
		start, err := time.Parse("2006-01-02", p.StartDate)
		if err != nil {
			continue
		}
		end, err := time.Parse("2006-01-02", p.EndDate)
		if err != nil {
			continue
		}

		dateRange := &entity.DateforRent{
			OpenDate:  start,
			CloseDate: end,
		}
		if err := c.DB.Create(dateRange).Error; err != nil {
			continue
		}

		rentAble := &entity.RentAbleDate{
			RentListID:    rentList.ID,
			DateforRentID: dateRange.ID,
		}
		c.DB.Create(rentAble)
	}

	// โหลด RentList พร้อม RentAbleDates & DateforRent
	c.DB.Preload("Car").
		Preload("RentAbleDates.DateforRent").
		First(&rentList, rentList.ID)

	ctx.JSON(http.StatusCreated, gin.H{
		"rent_list": rentList,
		"message":   "RentList created with multiple periods",
	})
}

// GetAllRentLists - GET /api/rentlists
func (c *RentListController) GetAllRentLists(ctx *gin.Context) {
	var rentLists []entity.RentList

	if err := c.DB.Preload("Car").
		Preload("RentAbleDates.DateforRent").
		Find(&rentLists).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, rentLists)
}

// GetRentListByID - GET /api/rentlists/:id
func (c *RentListController) GetRentListByID(ctx *gin.Context) {
	id := ctx.Param("id")
	var rentList entity.RentList

	if err := c.DB.Preload("Car").
		Preload("RentAbleDates.DateforRent").
		First(&rentList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "RentList not found"})
		return
	}

	ctx.JSON(http.StatusOK, rentList)
}

// UpdateRentList - PUT /api/rentlists/:id
func (c *RentListController) UpdateRentList(ctx *gin.Context) {
	id := ctx.Param("id")
	var rentList entity.RentList

	if err := c.DB.First(&rentList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "RentList not found"})
		return
	}

	var input entity.RentList
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rentList.Status = input.Status
	rentList.RentPrice = input.RentPrice
	rentList.ManagerID = input.ManagerID

	if err := c.DB.Save(&rentList).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, rentList)
}

// DeleteRentList - DELETE /api/rentlists/:id
func (c *RentListController) DeleteRentList(ctx *gin.Context) {
	id := ctx.Param("id")
	if err := c.DB.Delete(&entity.RentList{}, id).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "RentList deleted"})
}
