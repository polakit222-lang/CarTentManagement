package entity

import "gorm.io/gorm"

type SubModel struct {
	gorm.Model
	SubModel string `json:"sub_model"`

	//ModelID as foreign key
	ModelID *uint `json:"modelID"`
	Models  Model `gorm:"foreignKey:ModelID" json:"model"`

	// 1 SubModel can have many Details
	Details []Detail `gorm:"foreignKey:SubModelID"`
}
