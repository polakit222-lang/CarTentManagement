package entity

import (
	"time"

	"gorm.io/gorm"
)

type DateforRent struct {
	gorm.Model
	OpenDate  time.Time `json:"open_date"`
	CloseDate time.Time `json:"close_date"`
}
