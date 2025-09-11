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

// Constructor
func NewCarController(db *gorm.DB) *CarController {
	return &CarController{DB: db}
}

// GET /cars
// GET /cars
func (cc *CarController) GetAllCars(c *gin.Context) {
	var cars []entity.Car

	// Preload ทุก field ที่ frontend ต้องใช้
	if err := cc.DB.Preload("Detail.Brand").
		Preload("Detail.CarModel").
		Preload("Detail.SubModel").
		Preload("Pictures").
		Preload("Province").
		Preload("Employee").
		Preload("SaleList").
		Preload("RentList.RentAbleDates.DateforRent").
		Find(&cars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	type CarResponse struct {
		entity.Car
		SaleList []struct {
			SalePrice float64 `json:"sale_price"`
		} `json:"sale_list,omitempty"`
		RentList []struct {
			RentPrice     float64 `json:"rent_price"`
			RentStartDate string  `json:"rent_start_date,omitempty"`
			RentEndDate   string  `json:"rent_end_date,omitempty"`
		} `json:"rent_list,omitempty"`
	}

	var resp []CarResponse
	for _, car := range cars {
		cr := CarResponse{Car: car}

		// SaleList
		for _, s := range car.SaleList {
			cr.SaleList = append(cr.SaleList, struct {
				SalePrice float64 `json:"sale_price"`
			}{SalePrice: s.SalePrice})
		}

		// RentList
		for _, r := range car.RentList {
			startDate := ""
			endDate := ""
			if len(r.RentAbleDates) > 0 && r.RentAbleDates[0].DateforRent != nil {
				startDate = r.RentAbleDates[0].DateforRent.OpenDate.Format("2006-01-02")
				endDate = r.RentAbleDates[0].DateforRent.CloseDate.Format("2006-01-02")
			}
			cr.RentList = append(cr.RentList, struct {
				RentPrice     float64 `json:"rent_price"`
				RentStartDate string  `json:"rent_start_date,omitempty"`
				RentEndDate   string  `json:"rent_end_date,omitempty"`
			}{
				RentPrice:     r.RentPrice,
				RentStartDate: startDate,
				RentEndDate:   endDate,
			})
		}

		resp = append(resp, cr)
	}

	c.JSON(http.StatusOK, resp)
}
