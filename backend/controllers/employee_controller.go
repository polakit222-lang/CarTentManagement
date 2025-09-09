package controllers

import (
	"net/http"
	"strconv"

	"github.com/PanuAutawo/CarTentManagement/backend/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type EmployeeController struct {
	svc *services.EmployeeService
}

func NewEmployeeController(db *gorm.DB) *EmployeeController {
	return &EmployeeController{svc: services.NewEmployeeService(db)}
}

// GET /employees
func (ctl *EmployeeController) GetEmployees(c *gin.Context) {
	items, err := ctl.svc.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch employees"})
		return
	}
	c.JSON(http.StatusOK, items)
}

// GET /employees/:id
func (ctl *EmployeeController) GetEmployeeByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	item, err := ctl.svc.Get(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

// POST /employee/login
// (เวอร์ชันขั้นต่ำให้คอมไพล์ผ่าน; เติม logic auth ของคุณได้ภายหลัง)
func (ctl *EmployeeController) LoginEmployee(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "LoginEmployee not implemented yet"})
}

// GET /employees/me  (หลังผ่าน EmployeeAuthMiddleware)
func (ctl *EmployeeController) GetCurrentEmployee(c *gin.Context) {
	val, ok := c.Get("employeeID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	id, ok := val.(uint)
	if !ok || id == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	item, err := ctl.svc.Get(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

// PUT /employees/me  (หลังผ่าน EmployeeAuthMiddleware)
func (ctl *EmployeeController) UpdateCurrentEmployee(c *gin.Context) {
	val, ok := c.Get("employeeID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	id, ok := val.(uint)
	if !ok || id == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var patch map[string]any
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := ctl.svc.Update(id, patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}
	c.JSON(http.StatusOK, updated)
}
