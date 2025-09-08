package controllers

import (
	"net/http"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"github.com/PanuAutawo/CarTentManagement/backend/middleware"
)

type EmployeeController struct {
	DB *gorm.DB
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

	token, err := middleware.GenerateToken(employee.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"employee": gin.H{
			"id":        employee.ID,
			"firstName": employee.FirstName,
			"lastName":  employee.LastName,
			"email":     employee.Email,
		},
	})
}

// GET /employee/me (Protected)
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

	c.JSON(http.StatusOK, gin.H{"data": employee})
}

// POST /admin/employees
func (e *EmployeeController) CreateEmployee(c *gin.Context) {
	var newEmployee entity.Employee
	if err := c.ShouldBindJSON(&newEmployee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newEmployee.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	newEmployee.Password = string(hashedPassword)
	newEmployee.Birthday = time.Now()

	if err := e.DB.Create(&newEmployee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": newEmployee})
}

// GET /employees
func (e *EmployeeController) GetEmployees(c *gin.Context) {
	var employees []entity.Employee
	if err := e.DB.Find(&employees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// --- vvvvv --- ส่วนที่แก้ไข --- vvvvv ---
	// เปลี่ยนจากการส่ง {"data": employees} เป็นการส่ง employees (Array) ตรงๆ
	c.JSON(http.StatusOK, employees)
	// --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---
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

// PUT /admin/employees/:id
func (e *EmployeeController) UpdateEmployee(c *gin.Context) {
	id := c.Param("id")
	var employee entity.Employee
	if err := e.DB.First(&employee, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	var updatedInfo entity.Employee
	if err := c.ShouldBindJSON(&updatedInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if updatedInfo.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(updatedInfo.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		employee.Password = string(hashedPassword)
	}

	employee.FirstName = updatedInfo.FirstName
	employee.LastName = updatedInfo.LastName
	employee.Email = updatedInfo.Email
	employee.PhoneNumber = updatedInfo.PhoneNumber
	employee.Address = updatedInfo.Address
	employee.Sex = updatedInfo.Sex
	employee.Position = updatedInfo.Position

	if err := e.DB.Save(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": employee})
}

// DELETE /admin/employees/:id
func (e *EmployeeController) DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	if err := e.DB.Delete(&entity.Employee{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}