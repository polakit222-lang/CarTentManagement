package entity

import "gorm.io/gorm"

type Detail struct {
	gorm.Model
	BrandID    uint
	Brand      *Brand `gorm:"foreignKey:BrandID"`
	CarModelID uint
	CarModel   *CarModel `gorm:"foreignKey:CarModelID"`
	SubModelID uint
	SubModel   *SubModel `gorm:"foreignKey:SubModelID"`
}
