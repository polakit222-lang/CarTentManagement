package entity

import (
	"gorm.io/gorm"
)

type SubDistrict struct {
	gorm.Model
	SubDistrictName string `json:"SubDistrictName"` // แก้ไขแล้ว: เปลี่ยนชื่อฟิลด์

	DistrictID uint      `json:"DistrictID"`
	District   *District `gorm:"foreignKey:DistrictID" json:"District"` // แก้ไขแล้ว: เปลี่ยน Type เป็น *District

	PickupDelivery []PickupDelivery `gorm:"foreignKey:SubDistrictID"`
}
