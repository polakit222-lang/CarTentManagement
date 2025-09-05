package entity

import (
	"time"
	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model

	ProfileImage string    `json:"profileimage"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Password     string    `json:"password"`
	Email        string    `json:"email" gorm:"uniqueIndex"`
	PhoneNumber  string    `json:"phone_number"`
	Address      string    `json:"address"`
	Birthday     time.Time `json:"birthday"`
	Sex          string    `json:"sex"`
	Position     string    `json:"position"`
	Jobtype      time.Time `json:"jobtype"`
	TotalSales   Status    `json:"total_sales"`

	PickupDelivery []PickupDelivery `gorm:"foreignKey:EmployeeID"`
	Car            []Car            `gorm:"foreignKey:EmployeeID"`
	
	SaleList       []SaleList       `gorm:"foreignKey:EmployeeID"`
	SalesContract  []SalesContract  `gorm:"foreignKey:EmployeeID"`
	LeaveRequest   []LeaveRequest   `gorm:"foreignKey:EmployeeID"`
}
