package entity

import "gorm.io/gorm"

type Brand struct {
	gorm.Model
	BrandName         string

	// 1 Brand can have many Models
	Models []Model `gorm:"foreignKey:BrandID"`
}