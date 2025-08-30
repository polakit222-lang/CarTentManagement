package entity

import (
	"time"

	"gorm.io/gorm"
)

type InspectionAppointment struct {
	gorm.Model

	CustomerID uint      `json:"CustomerID"`
	Customer   *Customer `gorm:"foreignKey:CustomerID" json:"Customer"`

	Note string

	DateTime time.Time

	SaleContractID uint          `json:"SaleContractID"`
	SaleContract   *SaleContract `gorm:"foreignKey:SaleContractID" json:"SaleContract"`

	InspectionSystem []InspectionSystem `gorm:"foreignKey:InspectionAppointmentID"`
}
