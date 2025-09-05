package controllers

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SubDistrictController struct {
	DB *gorm.DB
}

func NewSubDistrictController(db *gorm.DB) *SubDistrictController {
	return &SubDistrictController{DB: db}
}

// GET /sub-districts/by-district/:districtID
func (ctrl *SubDistrictController) GetSubDistrictsByDistrict(c *gin.Context) {
	districtID := c.Param("districtID")
	var subDistricts []entity.SubDistrict

	if err := ctrl.DB.Where("district_id = ?", districtID).Find(&subDistricts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, subDistricts)
}