package entity

import (
	"time"

	"gorm.io/gorm"
)

type Insurance struct {
	gorm.Model
	PurchaseDate time.Time
	ExpirationDate time.Time

	// 1 Insurance can have many Status
	StatusID *uint
	Status   Status `gorm:"foreignKey:StatusID"`

	// SalesContractID as foreign key
	SalesContractID *uint
	SalesContract   SaleContract `gorm:"foreignKey:SaleContractID"`

	// 1 Insurance can have many PriceInsurance
	PriceInsurances []PriceInsurance `gorm:"foreignKey:InsuranceID"`
}