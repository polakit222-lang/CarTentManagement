package entity

import (

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Password  string
	Email     string
	Phone     string
	FirstName string
	LastName  string
	Birthday  string	`json:"birthday"`

	

	PickupDelivery []PickupDelivery `gorm:"foreignKey:CustomerID"` // แก้ไข: foreignKey เป็น CustomerID

	//for Appointment
	InspectionAppointments []InspectionAppointment `gorm:"foreignKey:CustomerID"` // แก้ไข: foreignKey เป็น CustomerID

	SalesContract   []SalesContract  `gorm:"foreignKey:CustomerID"`
}
