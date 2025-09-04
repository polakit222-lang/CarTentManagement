package entity

import "gorm.io/gorm"

type Brand struct {
	gorm.Model
	BrandName string `json:"brand_name"`

	// 1 Brand can have many Models
	Models []Model `gorm:"foreignKey:brandID"`
}
