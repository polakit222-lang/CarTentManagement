package controllers

import (
	"net/http"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PickupDeliveryController struct {
	DB *gorm.DB
}

func NewPickupDeliveryController(db *gorm.DB) *PickupDeliveryController {
	return &PickupDeliveryController{DB: db}
}

// preloadAssociations สำหรับดึงข้อมูลที่เกี่ยวข้องทั้งหมด
func (ctrl *PickupDeliveryController) preloadAssociations(db *gorm.DB) *gorm.DB {
	return db.Preload("Customer").
		Preload("TypeInformation").
		Preload("SalesContract").
		Preload("Employee").
		Preload("SubDistrict").
		Preload("District").
		Preload("Province")
}

// POST /pickup-deliveries (สร้างการนัดหมาย)
func (ctrl *PickupDeliveryController) CreatePickupDelivery(c *gin.Context) {
	var pickupDelivery entity.PickupDelivery
	if err := c.ShouldBindJSON(&pickupDelivery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Create(&pickupDelivery).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create pickup/delivery appointment: " + err.Error()})
		return
	}

	// ดึงข้อมูลที่สร้างเสร็จพร้อมข้อมูลที่ Preload กลับไป
	var createdPickupDelivery entity.PickupDelivery
	ctrl.preloadAssociations(ctrl.DB).First(&createdPickupDelivery, pickupDelivery.ID)

	c.JSON(http.StatusCreated, createdPickupDelivery)
}

// GET /pickup-deliveries (ดูการนัดหมายทั้งหมด)
func (ctrl *PickupDeliveryController) GetPickupDeliveries(c *gin.Context) {
	var pickupDeliveries []entity.PickupDelivery
	if err := ctrl.preloadAssociations(ctrl.DB).Find(&pickupDeliveries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pickupDeliveries)
}

// GET /pickup-deliveries/customer/:customerID (ดูการนัดหมายตาม CustomerID)
func (ctrl *PickupDeliveryController) GetPickupDeliveriesByCustomerID(c *gin.Context) {
	customerID := c.Param("customerID")
	var pickupDeliveries []entity.PickupDelivery

	if err := ctrl.preloadAssociations(ctrl.DB).Where("customer_id = ?", customerID).Find(&pickupDeliveries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pickupDeliveries)
}

// PUT /pickup-deliveries/:id (แก้ไขรายละเอียดทั้งหมด)
func (ctrl *PickupDeliveryController) UpdatePickupDelivery(c *gin.Context) {
	id := c.Param("id")
	var pickupDelivery entity.PickupDelivery
	if err := ctrl.DB.First(&pickupDelivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pickup/delivery appointment not found"})
		return
	}

	var input entity.PickupDelivery
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ใช้ Model(&pickupDelivery) เพื่อให้ GORM รู้ว่าจะอัปเดต record ตัวไหน
	if err := ctrl.DB.Model(&pickupDelivery).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ดึงข้อมูลล่าสุดกลับไป
	ctrl.preloadAssociations(ctrl.DB).First(&pickupDelivery, pickupDelivery.ID)
	c.JSON(http.StatusOK, pickupDelivery)
}

// PATCH /pickup-deliveries/:id/status (แก้ไขเฉพาะสถานะ)
func (ctrl *PickupDeliveryController) UpdatePickupDeliveryStatus(c *gin.Context) {
	id := c.Param("id")
	var pickupDelivery entity.PickupDelivery
	if err := ctrl.DB.First(&pickupDelivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pickup/delivery appointment not found"})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Model(&pickupDelivery).Update("status", input.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	ctrl.preloadAssociations(ctrl.DB).First(&pickupDelivery, pickupDelivery.ID)
	c.JSON(http.StatusOK, pickupDelivery)
}

// DELETE /pickup-deliveries/:id (ลบการนัดหมาย)
func (ctrl *PickupDeliveryController) DeletePickupDelivery(c *gin.Context) {
	id := c.Param("id")
	if tx := ctrl.DB.Delete(&entity.PickupDelivery{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pickup/delivery appointment not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Pickup/delivery appointment deleted successfully"})
}