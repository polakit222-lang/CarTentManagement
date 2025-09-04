package entity

import "gorm.io/gorm"

type Company struct {
	gorm.Model
	CompanyName string

	// 1 Company can have many InsurancePrices
	Prices []InsurancePrice `gorm:"foreignKey:CompanyID"`
}
