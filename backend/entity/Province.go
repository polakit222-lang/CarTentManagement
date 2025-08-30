package entity

import (
	"gorm.io/gorm"
)

type Province struct {
	gorm.Model
	ProvinceName string `json:"ProvinceName"`

	// 1 employee เป็นเจ้าของได้หลาย pickupdelivery
	PickupDelivery []PickupDelivery `gorm:"foreignKey:ProvinceID"`
	District       []District       `gorm:"foreignKey:ProvinceID"`
}
