package controllers

import (
	"fmt"
	"net/http"
	"time"

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

// GET /rentlists/:carId
func (rc *RentListController) GetRentListsByCar(c *gin.Context) {
	carId := c.Param("carId")

	var rentList entity.RentList
	if err := rc.DB.Preload("RentAbleDates.DateforRent").
		Where("car_id = ?", carId).
		First(&rentList).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RentList not found"})
		return
	}

	// ดึงข้อมูลรถพร้อม SaleList และ Pictures
	var car entity.Car
	if err := rc.DB.Preload("SaleList").Preload("Pictures").First(&car, rentList.CarID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
		return
	}

	// Flatten rent_able_dates → rent_list
	var rentPeriods []entity.RentPeriod
	for _, rad := range rentList.RentAbleDates {
		date := rad.DateforRent
		rentPeriods = append(rentPeriods, entity.RentPeriod{
			ID:            date.ID,
			RentPrice:     date.RentPrice,
			RentStartDate: date.OpenDate.Format("2006-01-02"),
			RentEndDate:   date.CloseDate.Format("2006-01-02"),
		})
	}

	// Flatten SaleList
	var sales []entity.SaleEntry
	for _, s := range car.SaleList {
		sales = append(sales, entity.SaleEntry{SalePrice: s.SalePrice})
	}

	// Flatten Pictures
	var pictures []entity.CarPicture
	for _, p := range car.Pictures {
		pictures = append(pictures, p)
	}

	// สร้าง CarResponse
	response := entity.CarResponse{
		ID:              car.ID,
		CarName:         car.CarName,
		YearManufacture: car.YearManufacture,
		Color:           car.Color,
		Mileage:         car.Mileage,
		Condition:       car.Condition,
		SaleList:        sales,
		RentList:        rentPeriods,
		Pictures:        pictures,
	}

	c.JSON(http.StatusOK, response)
}

// POST /rentlists
// CreateOrUpdateRentList
func (rc *RentListController) CreateOrUpdateRentList(c *gin.Context) {
	type DateInput struct {
		ID        uint    `json:"id"` // ✅ เพิ่ม id ไว้เช็คว่ามีอยู่แล้วไหม
		OpenDate  string  `json:"open_date"`
		CloseDate string  `json:"close_date"`
		RentPrice float64 `json:"rent_price"`
	}

	type Input struct {
		CarID     uint        `json:"car_id"`
		Status    string      `json:"status"`
		ManagerID uint        `json:"manager_id"`
		Dates     []DateInput `json:"dates"`
	}

	var input Input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var rentList entity.RentList
	err := rc.DB.Where("car_id = ?", input.CarID).First(&rentList).Error

	if err == gorm.ErrRecordNotFound {
		rentList = entity.RentList{
			CarID:     input.CarID,
			Status:    input.Status,
			ManagerID: input.ManagerID,
		}
		rc.DB.Create(&rentList)
	} else {
		rentList.Status = input.Status
		rc.DB.Save(&rentList)
	}

	// ✅ จัดการ periods
	for _, d := range input.Dates {
		open, _ := time.Parse("2006-01-02", d.OpenDate)
		close, _ := time.Parse("2006-01-02", d.CloseDate)

		if d.ID != 0 {
			// 👉 ถ้ามี id → update
			var existing entity.DateforRent
			if err := rc.DB.First(&existing, d.ID).Error; err == nil {
				existing.OpenDate = open
				existing.CloseDate = close
				existing.RentPrice = d.RentPrice
				rc.DB.Save(&existing)
			}
		} else {
			// 👉 ถ้าไม่มี id → create ใหม่
			date := entity.DateforRent{
				OpenDate:  open,
				CloseDate: close,
				RentPrice: d.RentPrice,
			}
			rc.DB.Create(&date)

			rc.DB.Create(&entity.RentAbleDate{
				RentListID:    rentList.ID,
				DateforRentID: date.ID,
			})
		}
	}

	// ✅ preload ให้ response กลับครบ
	rc.DB.Preload("RentAbleDates.DateforRent").First(&rentList, rentList.ID)
	c.JSON(http.StatusOK, rentList)
}

// DELETE /rentlists/date/:dateId
func (rc *RentListController) DeleteRentDate(c *gin.Context) {
	dateId := c.Param("dateId")
	var id uint
	fmt.Sscanf(dateId, "%d", &id)

	if err := rc.DB.Delete(&entity.RentAbleDate{}, "datefor_rent_id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := rc.DB.Delete(&entity.DateforRent{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Date deleted"})
}
