package entity

import "gorm.io/gorm"

type SubModel struct {
	gorm.Model
	SubModel string

	//ModelID as foreign key
	ModelID *uint
	Models   Model `gorm:"foreignKey:ModelID"`

	// 1 SubModel can have many Details
	Details []Detail `gorm:"foreignKey:SubModelID"`
}