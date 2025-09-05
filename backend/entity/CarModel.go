package entity

import "gorm.io/gorm"

type CarModel struct {
	gorm.Model
	ModelName string
	BrandID   uint       `json:"brandId"`
	Brand     *Brand     `json:"brand" gorm:"references:ID"`
	SubModels []SubModel `gorm:"foreignKey:CarModelID" json:"sub_model"` // CarModelID ใน SubModel
}
