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

// Struct สำหรับ Response
type EmployeeResponse struct {
	ID           uint      `json:"id"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	ProfileImage string    `json:"profile_image"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	PhoneNumber  string    `json:"phone_number"`
	Address      string    `json:"address"`
	Birthday     time.Time `json:"birthday"`
	Sex          string    `json:"sex"`
	Position     string    `json:"position"`
	JobType      time.Time `json:"job_type"`
}

func NewEmployeeController(db *gorm.DB) *EmployeeController {
	return &EmployeeController{DB: db}
}

// POST /employee/login
func (e *EmployeeController) LoginEmployee(c *gin.Context) {
	var loginInfo struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	var employee entity.Employee
	if err := e.DB.Where("email = ?", loginInfo.Email).First(&employee).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(employee.Password), []byte(loginInfo.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   employee.ID,
		"role": "employee",
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(configs.SECRET_KEY))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	response := EmployeeResponse{
		ID:           employee.ID,
		CreatedAt:    employee.CreatedAt,
		UpdatedAt:    employee.UpdatedAt,
		ProfileImage: employee.ProfileImage,
		FirstName:    employee.FirstName,
		LastName:     employee.LastName,
		Email:        employee.Email,
		PhoneNumber:  employee.PhoneNumber,
		Address:      employee.Address,
		Birthday:     employee.Birthday,
		Sex:          employee.Sex,
		Position:     employee.Position,
		JobType:      employee.JobType,
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Login successful",
		"token":    tokenString,
		"employee": response,
	})
}

// GET /employees/me
func (e *EmployeeController) GetCurrentEmployee(c *gin.Context) {
	employeeID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var employee entity.Employee
	if err := e.DB.First(&employee, employeeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	response := EmployeeResponse{
		ID:           employee.ID,
		CreatedAt:    employee.CreatedAt,
		UpdatedAt:    employee.UpdatedAt,
		ProfileImage: employee.ProfileImage,
		FirstName:    employee.FirstName,
		LastName:     employee.LastName,
		Email:        employee.Email,
		PhoneNumber:  employee.PhoneNumber,
		Address:      employee.Address,
		Birthday:     employee.Birthday,
		Sex:          employee.Sex,
		Position:     employee.Position,
		JobType:      employee.JobType,
	}
	c.JSON(http.StatusOK, gin.H{"data": response})
}

// PUT /employees/me
func (e *EmployeeController) UpdateCurrentEmployee(c *gin.Context) {
	employeeID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var employee entity.Employee
	if err := e.DB.First(&employee, employeeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	var updatedInfo struct {
		ProfileImage string    `json:"profile_image"`
		FirstName    string    `json:"first_name"`
		LastName     string    `json:"last_name"`
		PhoneNumber  string    `json:"phone_number"`
		Address      string    `json:"address"`
		Birthday     string    `json:"birthday"`
		Sex          string    `json:"sex"`
		Position     string    `json:"position"`
		JobType      time.Time `json:"job_type"`
	}

	if err := c.ShouldBindJSON(&updatedInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data: " + err.Error()})
		return
	}

	employee.ProfileImage = updatedInfo.ProfileImage
	employee.FirstName = updatedInfo.FirstName
	employee.LastName = updatedInfo.LastName
	employee.PhoneNumber = updatedInfo.PhoneNumber
	employee.Address = updatedInfo.Address
	employee.Sex = updatedInfo.Sex
	employee.Position = updatedInfo.Position
	employee.JobType = updatedInfo.JobType

	if err := e.DB.Save(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee data"})
		return
	}

	response := EmployeeResponse{
		ID:           employee.ID,
		CreatedAt:    employee.CreatedAt,
		UpdatedAt:    employee.UpdatedAt,
		ProfileImage: employee.ProfileImage,
		FirstName:    employee.FirstName,
		LastName:     employee.LastName,
		Email:        employee.Email,
		PhoneNumber:  employee.PhoneNumber,
		Address:      employee.Address,
		Birthday:     employee.Birthday,
		Sex:          employee.Sex,
		Position:     employee.Position,
		JobType:      employee.JobType,
	}
	c.JSON(http.StatusOK, gin.H{"data": response})
}

// GET /employees
func (e *EmployeeController) GetEmployees(c *gin.Context) {
	var employees []entity.Employee
	if err := e.DB.Find(&employees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, employees)
}

// GET /employees/:id
func (e *EmployeeController) GetEmployeeByID(c *gin.Context) {
	id := c.Param("id")
	var employee entity.Employee
	if err := e.DB.First(&employee, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": employee})
}
