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

// สร้าง struct สำหรับรับ input จาก frontend
type UpdateCustomerInput struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Birthday  string `json:"birthday"`
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
// @Failure 409 {object} gin.H
// @Router /register [post]
func (ctrl *CustomerController) RegisterCustomer(c *gin.Context) {
	var input entity.Customer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	input.Password = string(hashPassword)

	if err := ctrl.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
		return
	}

	c.JSON(http.StatusOK, input)
}

// GetCustomerByID godoc
// @Summary Get a single customer by ID
// @Description Retrieves a customer's details by their unique ID
// @Tags Customer
// @Produce json
// @Param id path int true "Customer ID"
// @Success 200 {object} entity.Customer
// @Failure 404 {object} gin.H
// @Router /customers/{id} [get]
func (ctrl *CustomerController) GetCustomerByID(c *gin.Context) {
	id := c.Param("id")
	var customer entity.Customer
	if err := ctrl.DB.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, customer)
}

// GetAllCustomers godoc
// @Summary Get all customers
// @Description Retrieves a list of all customers
// @Tags Admin
// @Produce json
// @Success 200 {array} entity.Customer
// @Router /admin/customers [get]
func (ctrl *CustomerController) GetAllCustomers(c *gin.Context) {
	var customers []entity.Customer
	if err := ctrl.DB.Find(&customers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, customers)
}

// UpdateCustomer godoc
// @Summary Update a customer
// @Description Updates a customer by their ID
// @Tags Admin
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param id path int true "Customer ID"
// @Param customer_data body UpdateCustomerInput true "Updated customer details"
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

	var input UpdateCustomerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customer.FirstName = input.FirstName
	customer.LastName = input.LastName
	customer.Email = input.Email
	customer.Phone = input.Phone
	customer.Birthday = input.Birthday

	if err := ctrl.DB.Save(&customer).Error; err != nil {
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
// @Success 204 "No Content"
// @Failure 404 {object} gin.H
// @Router /admin/customers/{id} [delete]
func (ctrl *CustomerController) DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Customer{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// LoginCustomer godoc
// @Summary Log in as a customer
// @Description Authenticates a customer and returns a JWT token
// @Tags Customer
// @Accept json
// @Produce json
// @Param login_data body LoginInput true "Customer login data"
// @Success 200 {object} gin.H "Logged in successfully"
// @Failure 401 {object} gin.H "Invalid email or password"
// @Failure 500 {object} gin.H "Failed to create token"
// @Router /login [post]
func (ctrl *CustomerController) LoginCustomer(c *gin.Context) {
	var loginInfo struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	var customer entity.Customer
	if err := ctrl.DB.Where("email = ?", loginInfo.Email).First(&customer).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(customer.Password), []byte(loginInfo.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   customer.ID,
		"role": "customer",
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(configs.SECRET_KEY))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Login successful",
		"token":    tokenString,
		"customer": customer,
	})
}

// GetCurrentCustomer godoc
// @Summary Get current logged-in customer's details
// @Description Retrieves the details of the customer currently logged in
// @Tags Customer
// @Security ApiKeyAuth
// @Produce json
// @Success 200 {object} entity.Customer
// @Failure 401 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /customers/me [get]
func (ctrl *CustomerController) GetCurrentCustomer(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}

	var customer entity.Customer
	if err := ctrl.DB.First(&customer, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, customer)
}