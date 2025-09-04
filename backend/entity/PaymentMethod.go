package entity

import (
	"gorm.io/gorm"
)

type PaymentMethod struct {
	gorm.Model

	MethodName  string `json:"methodname"`
	Description string `json:"description"`

	//ส่งให้ payment
	Payment []Payment `gorm:"foreignKey:PaymentMethodID"`
}
