package entity

import "gorm.io/gorm"

type Detail struct {
	gorm.Model

	// CarID as foreign key
	CarID *uint `json:"carID"`
	Car   Car   `gorm:"foreignKey:CarID" json:"car"`

	// SubModelID as foreign key
	SubModelID *uint    `json:"sub_modelID"`
	SubModel   SubModel `gorm:"foreignKey:SubModelID" json:"sub_model"`
}
