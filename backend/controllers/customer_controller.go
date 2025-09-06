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

type CustomerController struct {
	DB *gorm.DB
}

func NewCustomerController(db *gorm.DB) *CustomerController {
	return &CustomerController{DB: db}
}

type RegisterInput struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	Phone     string `json:"phone" binding:"required"`
	Birthday  string `json:"birthday" binding:"required"` // รับเป็น string จาก frontend
}

// RegisterCustomer godoc
// @Summary Register a new customer
// @Description Creates a new customer account
// @Tags Customer
// @Accept json
// @Produce json
// @Param customer_data body RegisterInput true "Customer registration data"
// @Success 200 {object} entity.Customer
// @Failure 400 {object} gin.H
// @Router /register [post]
func (ctrl *CustomerController) RegisterCustomer(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// ลบการแปลงค่า Birthday ออก เนื่องจากตอนนี้เป็น string แล้ว
	customer := entity.Customer{
		FirstName: input.FirstName,
		LastName: input.LastName,
		Email: input.Email,
		Password: string(hashedPassword),
		Phone: input.Phone,
		Birthday: input.Birthday, // Assign the string directly
	}

	if err := ctrl.DB.Create(&customer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, customer)
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginCustomer godoc
// @Summary Login for customers
// @Description Authenticates a customer and returns a JWT token
// @Tags Authentication
// @Accept json
// @Produce json
// @Param customer_credentials body LoginInput true "Customer login credentials"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Router /login [post]
func (ctrl *CustomerController) LoginCustomer(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var customer entity.Customer
	if err := ctrl.DB.Where("Email = ?", input.Email).First(&customer).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(customer.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Sign a token with Customer role
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": customer.ID,
		"role": "customer",
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(configs.SECRET_KEY))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	// This is the line that needs to be fixed. It should return both customer and token.
	c.JSON(http.StatusOK, gin.H{"customer": customer, "token": tokenString})
}

// GetCurrentCustomer godoc
// @Summary Get current customer's details
// @Description Retrieves the details of the currently authenticated customer
// @Tags Customer
// @Security ApiKeyAuth
// @Produce json
// @Success 200 {object} entity.Customer
// @Failure 401 {object} gin.H
// @Router /customers/me [get]
func (ctrl *CustomerController) GetCurrentCustomer(c *gin.Context) {
	customerID, exists := c.Get("customerID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var customer entity.Customer
	if err := ctrl.DB.First(&customer, customerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, customer)
}

// GetCustomers godoc
// @Summary Get all customers
// @Description Retrieves a list of all customers
// @Tags Admin
// @Security ApiKeyAuth
// @Produce json
// @Success 200 {array} entity.Customer
// @Router /admin/customers [get]
func (ctrl *CustomerController) GetCustomers(c *gin.Context) {
	var customers []entity.Customer
	if err := ctrl.DB.Find(&customers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customers)
}

// GetCustomerByID godoc
// @Summary Get a customer by ID
// @Description Retrieves a customer's details by their ID
// @Tags Admin
// @Security ApiKeyAuth
// @Produce json
// @Param id path int true "Customer ID"
// @Success 200 {object} entity.Customer
// @Failure 404 {object} gin.H
// @Router /admin/customers/{id} [get]
func (ctrl *CustomerController) GetCustomerByID(c *gin.Context) {
	id := c.Param("id")
	var customer entity.Customer
	if err := ctrl.DB.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}
	c.JSON(http.StatusOK, customer)
}

// UpdateCustomer godoc
// @Summary Update a customer's details
// @Description Updates the details of an existing customer
// @Tags Admin
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param id path int true "Customer ID"
// @Param customer_data body entity.Customer true "Updated customer details"
// @Success 200 {object} entity.Customer
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /admin/customers/{id} [put]
func (ctrl *CustomerController) UpdateCustomer(c *gin.Context) {
	id := c.Param("id")
	var customer entity.Customer
	if err := ctrl.DB.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	var input entity.Customer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.DB.Model(&customer).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customer)
}

// DeleteCustomer godoc
// @Summary Delete a customer
// @Description Deletes a customer by their ID
// @Tags Admin
// @Security ApiKeyAuth
// @Produce json
// @Param id path int true "Customer ID"
// @Success 200 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /admin/customers/{id} [delete]
func (ctrl *CustomerController) DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Customer{}, id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Customer deleted"})
}