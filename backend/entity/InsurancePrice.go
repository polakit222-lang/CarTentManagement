package entity

import "gorm.io/gorm"

type InsurancePrice struct {
	gorm.Model
	Price float64

	// CompanyID as foreign key
	CompanyID *uint
	Company   Company `gorm:"foreignKey:CompanyID"`

	// PlanID as foreign key
	PlanID *uint
	Plan   Plan `gorm:"foreignKey:PlanID"`

	// RepairID as foreign key
	RepairID *uint
	Repair   Repair `gorm:"foreignKey:RepairID"`

	// 1 Price can have many PriceInsurances
	PriceInsurances []PriceInsurance `gorm:"foreignKey:PriceID"`
}