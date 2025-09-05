package controllers

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TypeInformationController struct {
	DB *gorm.DB
}

func NewTypeInformationController(db *gorm.DB) *TypeInformationController {
	return &TypeInformationController{DB: db}
}

// GET /type-informations
func (ctrl *TypeInformationController) GetTypeInformations(c *gin.Context) {
	var typeInformations []entity.TypeInformation
	if err := ctrl.DB.Find(&typeInformations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, typeInformations)
}