package entity

import (
	"gorm.io/gorm"
)

type District struct {
	gorm.Model
	DistrictName string `json:"DistrictName"` // แก้ไข: เปลี่ยนชื่อฟิลด์เป็น DistrictName

	//foreign key
	ProvinceID uint      `json:"ProvinceID"`
	Province   *Province `gorm:"foreignKey:ProvinceID" json:"Province"`

	// 1 employee เป็นเจ้าของได้หลาย pickupdelivery
	SubDistrict    []SubDistrict    `gorm:"foreignKey:DistrictID"`
	PickupDelivery []PickupDelivery `gorm:"foreignKey:DistrictID"`
	// Playlists []Playlist `gorm:"foreignKey:MemberID"`
}
