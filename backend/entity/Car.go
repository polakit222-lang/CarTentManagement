package entity

import "gorm.io/gorm"

type Car struct {
	gorm.Model

	Brand    string
	CarModel string
	Year     int
	MDetail  string

	ProvinceID uint      `json:"ProvinceID"`
	Province   *Province `gorm:"foreignKey:ProvinceID" json:"Province"`

	Type   string
	Detail string

	EmployeeID uint      `json:"EmployeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"Employee"`
}
