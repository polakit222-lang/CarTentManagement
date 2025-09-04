package entity

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Username  string
	Password  string
	Email     string
	Phone     string
	FirstName string
	LastName  string
	Birthday  time.Time

	

	PickupDelivery []PickupDelivery `gorm:"foreignKey:CustomerID"` // แก้ไข: foreignKey เป็น CustomerID

	//for Appointment
	InspectionAppointments []InspectionAppointment `gorm:"foreignKey:CustomerID"` // แก้ไข: foreignKey เป็น CustomerID

	SalesContract   []SalesContract  `gorm:"foreignKey:CustomerID"`
}
