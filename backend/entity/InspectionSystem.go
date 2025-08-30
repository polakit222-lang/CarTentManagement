package entity

import (
	"gorm.io/gorm"
)

type InspectionSystem struct {
	gorm.Model

	InspectionAppointmentID uint                   `json:"InspectionAppointmentID"`
	InspectionAppointment   *InspectionAppointment `gorm:"foreignKey:InspectionAppointmentID" json:"InspectionAppointment"`

	CarSystemID uint       `json:"CarSystemID"`
	CarSystem   *CarSystem `gorm:"foreignKey:CarSystemID" json:"CarSystem"`
}
