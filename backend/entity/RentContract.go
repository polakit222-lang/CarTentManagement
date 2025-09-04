package entity

import (
	"gorm.io/gorm"

	"time"
)

type RentContract struct {
	gorm.Model

	PriceAgree float64   `json:"price_agree"`
	DateStart  time.Time `json:date_start`
	DateEnd    time.Time `json:date_end`

	RentListID uint      `json:"rent_listID"`
	RentList   *RentList `gorm: "foreignKey:RentListID" json:"rent_list"`

	EmployeeID uint      `json:"employeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

	CustomerID uint      `json:"employeeID"`
	Customer   *Customer `gorm:"foreignKey:CustomerID" json:"customer"`
}
