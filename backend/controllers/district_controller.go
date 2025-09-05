package controllers

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DistrictController struct {
	DB *gorm.DB
}

func NewDistrictController(db *gorm.DB) *DistrictController {
	return &DistrictController{DB: db}
}

// GET /districts/by-province/:provinceID
func (ctrl *DistrictController) GetDistrictsByProvince(c *gin.Context) {
	provinceID := c.Param("provinceID")
	var districts []entity.District

	if err := ctrl.DB.Where("province_id = ?", provinceID).Find(&districts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, districts)
}