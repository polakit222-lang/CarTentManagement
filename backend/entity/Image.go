package entity

import (
	"gorm.io/gorm"
)

type Image struct {
	gorm.Model
	Path          string `json:"path"` // ใช้ string สำหรับเก็บ path ของไฟล์รูป
	ImageMimeType string `json:"image_mime_type"`

	// CarID as foreign key
	CarID *uint `json:"carID"`
	Car   Car   `gorm:"foreignKey:CarID"`
}
