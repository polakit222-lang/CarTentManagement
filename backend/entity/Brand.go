package entity

import "gorm.io/gorm"

type Brand struct {
	gorm.Model
	BrandName string     `json:"brand_name"`
	CarModels []CarModel `gorm:"foreignKey:BrandID" json:"car_model"` // BrandID ใน CarModel
}
