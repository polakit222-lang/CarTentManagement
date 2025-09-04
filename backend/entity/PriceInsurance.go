package entity

import "gorm.io/gorm"

type PriceInsurance struct {
	gorm.Model
	Price  *InsurancePrice  `gorm:"foreignKey:PriceID" json:"price"`   

	// InsuranceID as foreign key
	InsuranceID *uint
	Insurance   Insurance `gorm:"foreignKey:InsuranceID"`

	// PriceID as foreign key
	PriceID *uint
	Prices   InsurancePrice `gorm:"foreignKey:PriceID"`
}
