package entity

import (
	"gorm.io/gorm"
)

type SaleList struct {
	gorm.Model
	SalePrice float64 `json:"sele_price"`

	CarID  uint   `json:"carID"`
	Car    *Car   `gorm:"foreignKey:CarID" json:"car"`
	Status string `json:"status"`

	ManagerID uint     `json:"managerID"`
	Manager   *Manager `gorm:"foreignKey:ManagerID" json:"manager"`

	EmployeeID uint      `json:"employeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

	SaleContract []SaleContract `gorm: "foreignKey:SaleListID" json:"sale_contract"`
}
