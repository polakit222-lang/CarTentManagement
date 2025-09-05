package controllers

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProvinceController struct {
	DB *gorm.DB
}

func NewProvinceController(db *gorm.DB) *ProvinceController {
	return &ProvinceController{DB: db}
}

// GET /provinces
func (ctrl *ProvinceController) GetProvinces(c *gin.Context) {
	var provinces []entity.Province
	if err := ctrl.DB.Find(&provinces).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, provinces)
}