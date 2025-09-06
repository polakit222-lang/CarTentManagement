// backend/controllers/manager_controller.go
package controllers

import (
	"net/http"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/configs"
	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type ManagerController struct {
	DB *gorm.DB
}

func NewManagerController(db *gorm.DB) *ManagerController {
	return &ManagerController{DB: db}
}

type LoginManagerInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// ManagerLogin godoc
// @Summary Login for managers
// @Description Authenticates a manager and returns a JWT token
// @Tags Authentication
// @Accept json
// @Produce json
// @Param manager_credentials body LoginManagerInput true "Manager login credentials"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Router /manager/login [post]
func (ctrl *ManagerController) LoginManager(c *gin.Context) {
	var input LoginManagerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var manager entity.Manager
	if err := ctrl.DB.Where("Email = ?", input.Email).First(&manager).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(manager.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Sign a token with Manager role
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   manager.ID,
		"role": "manager",
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(configs.SECRET_KEY))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"manager": manager, "token": tokenString})
}