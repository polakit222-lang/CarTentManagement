package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model

	Amount      string    `json:"amount"`
	PaymentDate time.Time `json:"payment_date"`
	Status      string    `json:"status"`

	CustomerID uint
	Customer   *Customer `gorm:"foreignKey:CustomerID" json:"customer"`

	EmployeeID uint
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

	RentContractID uint
	RentContract   *RentContract `gorm:"foreignKey:RentContractID" json:"rent_contract"`

	SalesContractID uint
	SalesContract   *SalesContract `gorm:"foreignKey:SalesContractID" json:"sales_contract"`

	PaymentMethodID uint
	PaymentMethod   *PaymentMethod `gorm:"foreignKey:PaymentMethodID" json:"payment_method"`

	Receipt []*Receipt `gorm:"foreignKey:PaymentID" json:"receipts"`
}
