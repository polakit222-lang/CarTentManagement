package controllers

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CarSystemController struct {
	DB *gorm.DB
}

func NewCarSystemController(db *gorm.DB) *CarSystemController {
	return &CarSystemController{DB: db}
}

// GET /car-systems
func (ctrl *CarSystemController) GetCarSystems(c *gin.Context) {
	var carSystems []entity.CarSystem
	if err := ctrl.DB.Find(&carSystems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, carSystems)
}