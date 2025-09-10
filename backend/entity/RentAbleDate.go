package entity

import "gorm.io/gorm"

type RentAbleDate struct {
	gorm.Model

	RentListID uint
	RentList   *RentList `gorm:"foreignKey:RentListID" json:"rent_list"`

	DateforRentID uint
	DateforRent   *DateforRent `gorm:"foreignKey:DateforRentID" json:"date_for_rent"` // ✅ pointer
}
