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

type EmployeeController struct {
	DB *gorm.DB
}

func NewEmployeeController(db *gorm.DB) *EmployeeController {
	return &EmployeeController{DB: db}
}

type LoginEmployeeInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginEmployee godoc
// @Summary Login for employees
// @Description Authenticates an employee and returns a JWT token
// @Tags Authentication
// @Accept json
// @Produce json
// @Param employee_credentials body LoginEmployeeInput true "Employee login credentials"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Router /employee/login [post]
func (ctrl *EmployeeController) LoginEmployee(c *gin.Context) {
	var input LoginEmployeeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var employee entity.Employee
	if err := ctrl.DB.Where("Email = ?", input.Email).First(&employee).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(employee.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Sign a token with Employee role
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   employee.ID,
		"role": "employee", // Role is now hardcoded for this endpoint
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(configs.SECRET_KEY))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"employee": employee, "token": tokenString})
}

// GetCurrentEmployee godoc
// @Summary Get current employee's details
// @Description Retrieves the details of the currently authenticated employee
// @Tags Employee
// @Security ApiKeyAuth
// @Produce json
// @Success 200 {object} entity.Employee
// @Failure 401 {object} gin.H
// @Router /employee/me [get]
func (ctrl *EmployeeController) GetCurrentEmployee(c *gin.Context) {
	employeeID, exists := c.Get("employeeID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var employee entity.Employee
	if err := ctrl.DB.First(&employee, employeeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	c.JSON(http.StatusOK, employee)
}

// GetEmployees godoc
// @Summary Get all employees
// @Description Retrieves a list of all employees
// @Tags Admin
// @Security ApiKeyAuth
// @Produce json
// @Success 200 {array} entity.Employee
// @Router /admin/employees [get]
func (ctrl *EmployeeController) GetEmployees(c *gin.Context) {
	var employees []entity.Employee
	if err := ctrl.DB.Find(&employees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, employees)
}

// GetEmployeeByID godoc
// @Summary Get an employee by ID
// @Description Retrieves an employee's details by their ID
// @Tags Admin
// @Security ApiKeyAuth
// @Produce json
// @Param id path int true "Employee ID"
// @Success 200 {object} entity.Employee
// @Failure 404 {object} gin.H
// @Router /admin/employees/{id} [get]
func (ctrl *EmployeeController) GetEmployeeByID(c *gin.Context) {
	id := c.Param("id")
	var employee entity.Employee
	if err := ctrl.DB.Preload("PickupDelivery").First(&employee, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}
	c.JSON(http.StatusOK, employee)
}

// CreateEmployee godoc
// @Summary Create a new employee
// @Description Creates a new employee account
// @Tags Admin
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param employee_data body entity.Employee true "Employee registration data"
// @Success 200 {object} entity.Employee
// @Failure 400 {object} gin.H
// @Router /admin/employees [post]
func (ctrl *EmployeeController) CreateEmployee(c *gin.Context) {
	var employee entity.Employee
	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.DB.Create(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, employee)
}

// UpdateEmployee godoc
// @Summary Update an employee's details
// @Description Updates the details of an existing employee
// @Tags Admin
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param id path int true "Employee ID"
// @Param employee_data body entity.Employee true "Updated employee details"
// @Success 200 {object} entity.Employee
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /admin/employees/{id} [put]
func (ctrl *EmployeeController) UpdateEmployee(c *gin.Context) {
	id := c.Param("id")
	var employee entity.Employee
	if err := ctrl.DB.First(&employee, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	var input entity.Employee
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Model(&employee).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, employee)
}

// DeleteEmployee godoc
// @Summary Delete an employee
// @Description Deletes an employee by their ID
// @Tags Admin
// @Security ApiKeyAuth
// @Produce json
// @Param id path int true "Employee ID"
// @Success 200 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /admin/employees/{id} [delete]
func (ctrl *EmployeeController) DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Employee{}, id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted"})
}