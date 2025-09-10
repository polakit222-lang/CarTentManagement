package entity

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model

	ProfileImage string    `json:"profile_image"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Password     string    `json:"password"`
	Email        string    `json:"email" gorm:"uniqueIndex"`
	PhoneNumber  string    `json:"phone_number"`
	Address      string    `json:"address"`
	Birthday     time.Time `json:"start_date"`
	Birthday     time.Time `json:"birthday"`
	Sex          string    `json:"sex"`
	Position     string    `json:"position"`

	TotalSales Status `json:"total_sales" gorm:"-"` // ไม่ map ลง DB

	PickupDelivery []PickupDelivery `gorm:"foreignKey:EmployeeID"`
	Car            []Car            `gorm:"foreignKey:EmployeeID"`
	PickupDelivery []PickupDelivery `gorm:"foreignKey:EmployeeID" json:"pickup_deliveries"`
	Cars           []Car            `gorm:"foreignKey:EmployeeID" json:"cars"`

	SaleList      []SaleList      `gorm:"foreignKey:EmployeeID" json:"sale_list"`
	SalesContract []SalesContract `gorm:"foreignKey:EmployeeID" json:"sales_contracts"`
	LeaveRequest  []LeaveRequest  `gorm:"foreignKey:EmployeeID" json:"leave_requests"`
}
