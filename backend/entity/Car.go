package entity

import (
	"time"

	"gorm.io/gorm"
)

type Car struct {
	gorm.Model
	CarName         string    `json:"car_name"`
	YearManufacture int       `json:"year_manufacture"`
	PurchasePrice   float64   `json:"purchase_price"`
	PurchaseDate    time.Time `json:"purchase_date"`
	Color           string    `json:"color"`
	Mileage         int       `json:"mileage"`
	Condition       string    `json:"condition"`

	Pictures []CarPicture `gorm:"foreignKey:CarID" json:"pictures"`

	ProvinceID uint      `json:"province_id"`
	Province   *Province `gorm:"foreignKey:ProvinceID" json:"province"`

	EmployeeID uint
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

	DetailID uint    `json:"detail_id"`
	Detail   *Detail `gorm:"foreignKey:DetailID" json:"detail"`
}
