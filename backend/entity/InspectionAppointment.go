package entity

import (
	"time"

	"gorm.io/gorm"
)

type InspectionAppointment struct {
	gorm.Model

	CustomerID uint      `json:"CustomerID"`
	Customer   *Customer `gorm:"foreignKey:CustomerID" json:"Customer"`

	Note string `json:"note"`

	DateTime time.Time `json:"date_time"`

	SaleContractID uint          `json:"SaleContractID"`
	SaleContract   *SalesContract `gorm:"foreignKey:SalesContractID" json:"SalesContract"`

	InspectionStatus string `json:"inspection_status"`


	InspectionSystem []InspectionSystem `gorm:"foreignKey:InspectionAppointmentID"`
}
