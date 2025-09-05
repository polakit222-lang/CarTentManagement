package entity

import (
	"time"

	"gorm.io/gorm"
)

type SubModel struct {
	ID           uint `gorm:"primaryKey"`
	SubModelName string
	CarModelID   uint      // ต้องตรงกับคอลัมน์ใน DB
	CarModel     *CarModel `gorm:"foreignKey:CarModelID;references:ID"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}
