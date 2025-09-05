package entity

import (
	"gorm.io/gorm"
)

type CarPicture struct {
	gorm.Model
	Title string `json:"title"`
	Path  string `json:"path"`                        // URL หรือ path ของรูป
	CarID uint   `json:"car_id"`                      // foreign key
	Car   *Car   `gorm:"foreignKey:CarID" json:"car"` // ความสัมพันธ์กับ Car
}
