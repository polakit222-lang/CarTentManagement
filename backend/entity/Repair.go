package entity

import "gorm.io/gorm"

type Repair struct {
	gorm.Model
	RepairType string

	// 1 Repair can have many InsurancePrices
	InsurancePrices []InsurancePrice `gorm:"foreignKey:RepairID"`
}
