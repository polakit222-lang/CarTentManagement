package entity

import "gorm.io/gorm"

type Detail struct {
	gorm.Model

	// CarID as foreign key
	CarID *uint
	Car   Car `gorm:"foreignKey:CarID"`

	// SubModelID as foreign key
	SubModelID *uint
	SubModel   SubModel `gorm:"foreignKey:SubModelID"`
}
