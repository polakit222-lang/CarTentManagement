package entity

import (
	"gorm.io/gorm"
)

type TypeInformation struct {
	gorm.Model
	Type string `json:"type"`

	// 1 type เป็นเจ้าของได้หลาย pickupdelivery
	PickupDelivery []PickupDelivery `gorm:"foreignKey:TypeInformationID"`
}
