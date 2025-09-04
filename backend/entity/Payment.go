package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model

	Amount      string
	PaymentDate time.Time
	Status      string

	CustomerID uint
	Customer   *Customer `gorm:"foreignKey:CustomerID"`

	EmployeeID uint
	Employee   *Employee `gorm:"foreignKey:EmployeeID"`

	RentContractID uint
	RentContract   *RentContract `gorm:"foreignKey:RentContractID"`

	SalesContractID uint
	SalesContract   *SalesContract `gorm:"foreignKey:SalesContractID"`

	PaymentMethodID uint
	PaymentMethod   *PaymentMethod `gorm:"foreignKey:PaymentMethodID"`

	Receipt []*Receipt `gorm:"foreignKey:PaymentID"`
}
