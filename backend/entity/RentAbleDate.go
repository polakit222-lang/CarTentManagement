package entity

import "gorm.io/gorm"

type RentAbleDate struct {
	gorm.Model

	RentListID uint     `json:"rent_listID"`
	RentList   RentList `gorm:"foreignKey:RentListID" json:"rent_list"`

	DateforRentID uint        `json:"date_for_rentID"`
	DateforRent   DateforRent `gorm:"foreignKey:DateforRentID" json:"date_for_rent"`
}
