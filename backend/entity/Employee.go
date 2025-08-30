package entity

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model

	FirstName   string
	LastName    string
	Password    string
	Position    string
	PhoneNumber string
	StartDate   time.Time
	TotalSales  float64

	PickupDelivery []PickupDelivery `gorm:"foreignKey:EmployeeID"`
	Car            []Car            `gorm:"foreignKey:EmployeeID"`
	SaleContracts  []SaleContract   `gorm:"foreignKey:EmployeeID"`
	SaleList       []SaleList       `gorm:"foreignKey:EmployeeID"`
}
