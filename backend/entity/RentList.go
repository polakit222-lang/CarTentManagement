package entity

import (
	"gorm.io/gorm"
)

type RentList struct {
	gorm.Model

	CarID  uint   `json:"carID"`
	Car    *Car   `gorm:"foreignKey:CarID" json:"car"`
	Status string `json:"status"`

	RentPrice float64 `json:"rent_price"`

	ManagerID     uint           `json:"managerID"`
	Manager       *Manager       `gorm:"foreignKey:ManagerID" json:"manager"`
	RentAbleDates []RentAbleDate `gorm:"foreignKey:RentListID"`
	RentContract  []RentContract `gorm: "foreignKey:RentListID" json:"rent_contract"`
}
