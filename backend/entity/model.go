package entity

import "gorm.io/gorm"

type Model struct {
	gorm.Model
	ModelName string `json:"model_name"`

	// BrandID as foreign key
	BrandID *uint `json:"brandID"`
	Brand   Brand `gorm:"foreignKey:brand" json:"brand"`

	// 1 Model can have many SubModels
	SubModels []SubModel `gorm:"foreignKey:modelID" json:"sub_models"`
}
