package controllers

import (
	"net/http"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// InspectionAppointmentInput เป็น struct สำหรับรับข้อมูลเมื่อสร้างหรืออัปเดต
type InspectionAppointmentInput struct {
	CustomerID       uint      `json:"CustomerID"`
	Note             string    `json:"note"`
	DateTime         time.Time `json:"date_time"`
	SalesContractID  uint      `json:"SalesContractID"`
	InspectionStatus string    `json:"inspection_status"`
	CarSystemIDs     []uint    `json:"CarSystemIDs"` // รับ ID ของ CarSystem เป็น Array
}

type InspectionAppointmentController struct {
	DB *gorm.DB
}

func NewInspectionAppointmentController(db *gorm.DB) *InspectionAppointmentController {
	return &InspectionAppointmentController{DB: db}
}

// POST /inspection-appointments
func (ctrl *InspectionAppointmentController) CreateInspectionAppointment(c *gin.Context) {
	var input InspectionAppointmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เริ่ม Transaction
	tx := ctrl.DB.Begin()

	// 1. สร้าง InspectionAppointment หลัก
	appointment := entity.InspectionAppointment{
		CustomerID:      input.CustomerID,
		Note:            input.Note,
		DateTime:        input.DateTime,
		SalesContractID: input.SalesContractID,
		InspectionStatus: input.InspectionStatus,
	}

	if err := tx.Create(&appointment).Error; err != nil {
		tx.Rollback() // ยกเลิก Transaction
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create appointment: " + err.Error()})
		return
	}

	// 2. วนลูปสร้างข้อมูลในตารางกลาง (InspectionSystem)
	for _, carSystemID := range input.CarSystemIDs {
		inspectionSystem := entity.InspectionSystem{
			InspectionAppointmentID: appointment.ID,
			CarSystemID:             carSystemID,
		}
		if err := tx.Create(&inspectionSystem).Error; err != nil {
			tx.Rollback() // ยกเลิก Transaction
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create inspection system link: " + err.Error()})
			return
		}
	}

	// ยืนยัน Transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed: " + err.Error()})
		return
	}
	
	// ดึงข้อมูลที่สร้างเสร็จสมบูรณ์กลับไป (เพื่อให้มีข้อมูล InspectionSystem.CarSystem แสดงด้วย)
    var createdAppointment entity.InspectionAppointment
    ctrl.DB.Preload("Customer").
		Preload("SalesContract").
		Preload("InspectionSystem.CarSystem").
		First(&createdAppointment, appointment.ID)

	c.JSON(http.StatusCreated, createdAppointment)
}


// GET /inspection-appointments
func (ctrl *InspectionAppointmentController) GetInspectionAppointments(c *gin.Context) {
	var appointments []entity.InspectionAppointment
	if err := ctrl.DB.Preload("Customer").Preload("SalesContract").Preload("InspectionSystem.CarSystem").Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, appointments)
}

// GET /inspection-appointments/:id
func (ctrl *InspectionAppointmentController) GetInspectionAppointmentByID(c *gin.Context) {
	id := c.Param("id")
	var appointment entity.InspectionAppointment
	if err := ctrl.DB.Preload("Customer").Preload("SalesContract").Preload("InspectionSystem.CarSystem").First(&appointment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inspection appointment not found"})
		return
	}
	c.JSON(http.StatusOK, appointment)
}

// GET /inspection-appointments/customer/:customerID
func (ctrl *InspectionAppointmentController) GetInspectionAppointmentsByCustomerID(c *gin.Context) {
	customerID := c.Param("customerID")
	var appointments []entity.InspectionAppointment

	if err := ctrl.DB.
		Preload("Customer").
		Preload("SalesContract").
		Preload("InspectionSystem.CarSystem").
		Where("customer_id = ?", customerID).
		Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(appointments) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No inspection appointments found for this customer"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

// PUT /inspection-appointments/:id
func (ctrl *InspectionAppointmentController) UpdateInspectionAppointment(c *gin.Context) {
	id := c.Param("id")
	var appointment entity.InspectionAppointment
	if err := ctrl.DB.First(&appointment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inspection appointment not found"})
		return
	}

	var input entity.InspectionAppointment
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Model(&appointment).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, appointment)
}

// PATCH /inspection-appointments/:id/status
func (ctrl *InspectionAppointmentController) UpdateInspectionAppointmentStatus(c *gin.Context) {
	id := c.Param("id")
	var appointment entity.InspectionAppointment
	if err := ctrl.DB.First(&appointment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inspection appointment not found"})
		return
	}

	var input struct {
		InspectionStatus string `json:"inspection_status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Model(&appointment).Update("inspection_status", input.InspectionStatus).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, appointment)
}

// DELETE /inspection-appointments/:id
func (ctrl *InspectionAppointmentController) DeleteInspectionAppointment(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.InspectionAppointment{}, id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Inspection appointment deleted"})
}