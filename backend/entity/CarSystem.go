package entity

import (
	"gorm.io/gorm"
)

type CarSystem struct {
	gorm.Model
	SystemName string `json:"system_name"`

	// 1 type เป็นเจ้าของได้หลาย pickupdelivery
	InspectionSystem []InspectionSystem `gorm:"foreignKey:CarSystemID"`
}
