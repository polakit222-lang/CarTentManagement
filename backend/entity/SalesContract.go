package entity

import (
"gorm.io/gorm"
)

type SalesContract struct {
	gorm.Model

	SaleListID uint `json:"sale_listID"`
	SaleList *SaleList `gorm: "foreignKey:SaleListID" json:"sale_list"`

	EmployeeID uint      `json:"employeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

}