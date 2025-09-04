package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model

	Amount      string    `json:"amount"`
	PaymentDate time.Time `json:"paymentdate"`
	Status      string    `json:"status"`

	CustomerID uint      `json:"CustomerID"`
	Customer   *Customer `gorm:"foreignKey:CustomerID" json:"Customer"`

	EmployeeID uint      `json:"employeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

	RentContractID uint          `json:"rentcontractID"`
	RentContract   *RentContract `gorm:"foreignKey:RentContractID" json:"RentContract"`

	SalesContractID uint          `json:"SalesContractID"`
	SalesContract   *SalesContract `gorm:"foreignKey:SalesContractID" json:"SalesContract"`

	PaymentMethodID uint `json:"PaymentMethodID"`
	PaymentMethod *PaymentMethod `gorm:"foreignKey:PaymentMethodID" json:"PaymentMethod"`

	//ส่งไป receipt
	Receipt []Receipt `gorm:"foreignKey:PaymentID"`
}
