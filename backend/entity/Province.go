package entity

import (
	"gorm.io/gorm"
)

type Province struct {
	gorm.Model
	ProvinceName string `gorm:"column:province_name" json:"province_name"`
	Cars         []Car  `gorm:"foreignKey:ProvinceID" json:"cars"`

	// 1 employee เป็นเจ้าของได้หลาย pickupdelivery
	PickupDelivery []PickupDelivery `gorm:"foreignKey:ProvinceID"`
	District       []District       `gorm:"foreignKey:ProvinceID"`
}
