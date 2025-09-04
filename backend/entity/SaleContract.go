package entity

import "gorm.io/gorm"

type SaleContract struct {
	gorm.Model

	Status string

	CustomerID uint      `json:"CustomerID"`
	Customer   *Customer `gorm:"foreignKey:CustomerID" json:"Customer"`

	// Corrected to match the Car model's foreign key
	CarID uint `json:"CarID"`
	Car   *Car `gorm:"foreignKey:CarID" json:"Car"`

	EmployeeID uint      `json:"EmployeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"Employee"`

	//for Appointment
	InspectionAppointments []InspectionAppointment `gorm:"foreignKey:SaleContractID"`

	//ส่งไป payment
	Payment []Payment `gorm:"foreignKey:SaleContractID"`
}
