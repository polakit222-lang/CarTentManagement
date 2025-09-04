package entity

import "gorm.io/gorm"

type Brand struct {
	gorm.Model
	BrandName string
	CarModels []CarModel `gorm:"foreignKey:BrandID"` // BrandID ใน CarModel
}
