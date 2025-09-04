package entity

import (
	"time"

	"gorm.io/gorm"
)

type Car struct {
	gorm.Model
	YearManufacture int       `json:"year"`
	PurchaseDate    time.Time `json:"purchase_date"`
	PurchasePrice   float64   `json:"buy_price"`
	Color           string    `json:"color"`

	ProvinceID uint      `json:"provinceID"`
	Province   *Province `gorm:"foreignKey:ProvinceID" json:"province"`

	DetailID uint    `json:"detailID"`
	Detail   *Detail `gorm:"foreignKey:DetailID" json:"detail"`

	EmployeeID uint      `json:"employeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`
}
