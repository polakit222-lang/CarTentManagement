package entity

import (
	"gorm.io/gorm"
)

type Image struct {
	gorm.Model
	Image         []byte //`gorm:"type:blob"`

	// CarID as foreign key
	CarID *uint
	Car   Car `gorm:"foreignKey:CarID"`

}