package entity

import (
	"gorm.io/gorm"
)

type SaleList struct {
	gorm.Model
	SalePrice float64
	Discount  uint

	CarID uint `json:"CarID"`
	Car   *Car `gorm:"foreignKey:CarID" json:"Car"`

	ManagerID uint     `json:"ManagerID"`
	Manager   *Manager `gorm:"foreignKey:ManagerID" json:"Manager"`

	EmployeeID uint      `json:"EmployeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"Employee"`
}
