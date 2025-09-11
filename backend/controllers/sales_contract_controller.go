package controllers

import (
	"net/http"
	
	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SalesContractController is the struct for handling sales contract operations.
type SalesContractController struct {
	DB *gorm.DB
}

// NewSalesContractController creates a new instance of SalesContractController.
func NewSalesContractController(db *gorm.DB) *SalesContractController {
	return &SalesContractController{DB: db}
}

// POST /sales-contracts
// CreateSalesContract handles the creation of a new sales contract.
func (controller *SalesContractController) CreateSalesContract(c *gin.Context) {
	var payload struct {
		SaleListID uint `json:"SaleListID"`
		EmployeeID uint `json:"EmployeeID"`
		CustomerID uint `json:"CustomerID"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload: " + err.Error()})
		return
	}

	// Validate foreign keys exist
	var saleList entity.SaleList
	if err := controller.DB.First(&saleList, payload.SaleListID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "SaleList not found"})
		return
	}

	var employee entity.Employee
	if err := controller.DB.First(&employee, payload.EmployeeID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Employee not found"})
		return
	}

	var customer entity.Customer
	if err := controller.DB.First(&customer, payload.CustomerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Customer not found"})
		return
	}

	newSalesContract := entity.SalesContract{
		SaleListID: payload.SaleListID,
		EmployeeID: payload.EmployeeID,
		CustomerID: payload.CustomerID,
	}

	if err := controller.DB.Create(&newSalesContract).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": newSalesContract})
}

// GET /sales-contracts
// GetSalesContracts retrieves all sales contracts with related data.
func (controller *SalesContractController) GetSalesContracts(c *gin.Context) {
	var salesContracts []entity.SalesContract
	if err := controller.DB.Preload("SaleList").
		Preload("Employee").
		Preload("Customer").
		Preload("InspectionAppointments").
		Preload("Payment").
		Find(&salesContracts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": salesContracts})
}

// GET /sales-contracts/:id
// GetSalesContractByID retrieves a single sales contract by ID.
func (controller *SalesContractController) GetSalesContractByID(c *gin.Context) {
	id := c.Param("id")
	var salesContract entity.SalesContract
	if err := controller.DB.Preload("SaleList").
		Preload("Employee").
		Preload("Customer").
		Preload("InspectionAppointments").
		Preload("Payment").
		First(&salesContract, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SalesContract not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": salesContract})
}

// GET /sales-contracts/employee/:employeeID
// GetSalesContractsByEmployeeID retrieves all sales contracts for a specific employee.
func (controller *SalesContractController) GetSalesContractsByEmployeeID(c *gin.Context) {
	employeeID := c.Param("employeeID")
	var salesContracts []entity.SalesContract
	if err := controller.DB.Preload("SaleList").
		Preload("Employee").
		Preload("Customer").
		Preload("InspectionAppointments").
		Preload("Payment").
		Where("employee_id = ?", employeeID).
		Find(&salesContracts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": salesContracts})
}

// GET /sales-contracts/customer/:customerID
// GetSalesContractsByCustomerID retrieves all sales contracts for a specific customer.
func (controller *SalesContractController) GetSalesContractsByCustomerID(c *gin.Context) {
	customerID := c.Param("customerID")
	var salesContracts []entity.SalesContract
	if err := controller.DB.Preload("SaleList").
		Preload("Employee").
		Preload("Customer").
		Preload("InspectionAppointments").
		Preload("Payment").
		Where("customer_id = ?", customerID).
		Find(&salesContracts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": salesContracts})
}


// PUT /sales-contracts/:id
// UpdateSalesContract updates an existing sales contract.
func (controller *SalesContractController) UpdateSalesContract(c *gin.Context) {
	id := c.Param("id")
	var salesContract entity.SalesContract
	if err := controller.DB.First(&salesContract, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SalesContract not found"})
		return
	}

	var payload struct {
		SaleListID uint `json:"SaleListID"`
		EmployeeID uint `json:"EmployeeID"`
		CustomerID uint `json:"CustomerID"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload: " + err.Error()})
		return
	}

	salesContract.SaleListID = payload.SaleListID
	salesContract.EmployeeID = payload.EmployeeID
	salesContract.CustomerID = payload.CustomerID

	if err := controller.DB.Save(&salesContract).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update sales contract data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": salesContract})
}

// DELETE /sales-contracts/:id
// DeleteSalesContract deletes a sales contract by ID.
func (controller *SalesContractController) DeleteSalesContract(c *gin.Context) {
	id := c.Param("id")
	if err := controller.DB.Delete(&entity.SalesContract{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "SalesContract deleted successfully"})
}