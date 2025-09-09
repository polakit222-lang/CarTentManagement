package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/middleware"
	"github.com/PanuAutawo/CarTentManagement/backend/services"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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
func (ctl *EmployeeController) LoginEmployee(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Email == "" || body.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email and password are required"})
		return
	}

	emp, err := ctl.svc.GetByEmail(body.Email)
	if err != nil || bcrypt.CompareHashAndPassword([]byte(emp.Password), []byte(body.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	tokenStr, err := middleware.GenerateToken(emp.EmployeeID, "employee")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to sign token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": tokenStr, "employee": emp})
}

// GET /employees/me   (protected)
func (ctl *EmployeeController) GetCurrentEmployee(c *gin.Context) {
	val, ok := c.Get("userID")
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

// PUT /employees/me   (protected)
func (ctl *EmployeeController) UpdateCurrentEmployee(c *gin.Context) {
	val, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	id, ok := val.(uint)
	if !ok || id == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var dto struct {
		ProfileImage *string `json:"profileImage"`
		FirstName    *string `json:"firstName"`
		LastName     *string `json:"lastName"`
		Email        *string `json:"email"`
		Phone        *string `json:"phone"`
		Address      *string `json:"address"`
		Birthday     *string `json:"birthday"`
		Sex          *string `json:"sex"`
		Position     *string `json:"position"`
		JobType      *string `json:"jobType"`
		TotalSales   *string `json:"totalSales"`
	}
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patch := map[string]any{}
	if dto.ProfileImage != nil { patch["profileImage"] = *dto.ProfileImage }
	if dto.FirstName != nil    { patch["firstName"] = *dto.FirstName }
	if dto.LastName != nil     { patch["lastName"]  = *dto.LastName }
	if dto.Email != nil        { patch["email"]     = *dto.Email }
	if dto.Phone != nil        { patch["phone"]     = *dto.Phone }
	if dto.Address != nil      { patch["address"]   = *dto.Address }
	if dto.Sex != nil          { patch["sex"]       = *dto.Sex }
	if dto.Position != nil     { patch["position"]  = *dto.Position }
	if dto.JobType != nil      { patch["jobType"]   = *dto.JobType }
	if dto.TotalSales != nil   { patch["totalSales"]= *dto.TotalSales }
	if dto.Birthday != nil {
		if t, err := time.Parse(time.RFC3339, *dto.Birthday); err == nil {
			patch["birthday"] = t
		} else if t2, err2 := time.Parse("2006-01-02", *dto.Birthday); err2 == nil {
			patch["birthday"] = t2
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid birthday format"})
			return
		}
	}

	updated, err := ctl.svc.Update(id, patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile", "detail": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

// PUT /api/employees/:id
func (ctl *EmployeeController) UpdateEmployeeByID(c *gin.Context) {
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil || idInt <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var dto struct {
		ProfileImage *string `json:"profileImage"`
		FirstName    *string `json:"firstName"`
		LastName     *string `json:"lastName"`
		Email        *string `json:"email"`
		Phone        *string `json:"phone"`
		Address      *string `json:"address"`
		Birthday     *string `json:"birthday"`
		Sex          *string `json:"sex"`
		Position     *string `json:"position"`
		JobType      *string `json:"jobType"`
		TotalSales   *string `json:"totalSales"`
	}
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patch := map[string]any{}
	if dto.ProfileImage != nil { patch["profileImage"] = *dto.ProfileImage }
	if dto.FirstName != nil    { patch["firstName"] = *dto.FirstName }
	if dto.LastName != nil     { patch["lastName"]  = *dto.LastName }
	if dto.Email != nil        { patch["email"]     = *dto.Email }
	if dto.Phone != nil        { patch["phone"]     = *dto.Phone }
	if dto.Address != nil      { patch["address"]   = *dto.Address }
	if dto.Sex != nil          { patch["sex"]       = *dto.Sex }
	if dto.Position != nil     { patch["position"]  = *dto.Position }
	if dto.JobType != nil      { patch["jobType"]   = *dto.JobType }
	if dto.TotalSales != nil   { patch["totalSales"]= *dto.TotalSales }
	if dto.Birthday != nil {
		if t, err := time.Parse(time.RFC3339, *dto.Birthday); err == nil {
			patch["birthday"] = t
		} else if t2, err2 := time.Parse("2006-01-02", *dto.Birthday); err2 == nil {
			patch["birthday"] = t2
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid birthday format"})
			return
		}
	}

	updated, err := ctl.svc.Update(uint(idInt), patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update employee", "detail": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}
