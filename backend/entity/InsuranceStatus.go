package entity

import "gorm.io/gorm"

type Status struct {
	gorm.Model
	Status string

	// 1 Status can have many Insurance
	Insurance []Insurance `gorm:"foreignKey:StatusID"`
}
