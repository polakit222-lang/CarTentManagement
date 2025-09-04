package entity

import "gorm.io/gorm"

type Model struct {
	gorm.Model
	ModelName   string

	// BrandID as foreign key
	BrandID *uint
	Brand   Brand `gorm:"foreignKey:BrandID"`

	// 1 Model can have many SubModels
	SubModels []SubModel `gorm:"foreignKey:ModelID"`
}
