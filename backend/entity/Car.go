package entity

import (
	"time"

	"gorm.io/gorm"
)

type Car struct {
	gorm.Model
	CarName         string
	YearManufacture int
	PurchasePrice   float64
	PurchaseDate    time.Time
	Color           string

	ProvinceID uint
	Province   *Province `gorm:"foreignKey:ProvinceID"`
	EmployeeID uint
	Employee   *Employee `gorm:"foreignKey:EmployeeID"`

	DetailID uint
	Detail   *Detail `gorm:"foreignKey:DetailID"`
}
