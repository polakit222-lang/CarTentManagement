package entity

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model

	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Password    string    `json:"password"`
	Email       string    `json:"email" gorm:"uniqueIndex"`
	Position    string    `json:"position"`
	PhoneNumber string    `json:"phone_number"`
	StartDate   time.Time `json:"start_date"`
	TotalSales  float64   `json:"total_sales"`
	Status      string    `json: "status"`

	PickupDelivery []PickupDelivery `gorm:"foreignKey:EmployeeID"`
	Car            []Car            `gorm:"foreignKey:EmployeeID"`
	SaleContracts  []SaleContract   `gorm:"foreignKey:EmployeeID"`
	SaleList       []SaleList       `gorm:"foreignKey:EmployeeID"`
}
