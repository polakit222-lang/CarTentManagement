package entity

import (
	"time"

	"gorm.io/gorm"
)

type PickupDelivery struct {
	gorm.Model

	CustomerID uint      `json:"CustomerID"`
	Customer   *Customer `gorm:"foreignKey:CustomerID" json:"Customer"`

	// Corrected to use TypeInformationID as the foreign key
	TypeInformationID uint             `json:"TypeInformationID"`
	TypeInformation   *TypeInformation `gorm:"foreignKey:TypeInformationID" json:"TypeInformation"`

	// Corrected to use SaleContractID
	SaleContractID uint          `json:"SaleContractID"`
	SaleContract   *SaleContract `gorm:"foreignKey:SaleContractID" json:"SaleContract"`

	DateTime time.Time `json:"DateTime"`

	EmployeeID uint      `json:"EmployeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"Employee"`

	Address string `json:"Address"`

	SubDistrictID uint         `json:"SubDistrictID"`
	SubDistrict   *SubDistrict `gorm:"foreignKey:SubDistrictID" json:"SubDistrict"`

	DistrictID uint      `json:"DistrictID"`
	District   *District `gorm:"foreignKey:DistrictID" json:"District"`

	ProvinceID uint      `json:"ProvinceID"`
	Province   *Province `gorm:"foreignKey:ProvinceID" json:"Province"`
}
