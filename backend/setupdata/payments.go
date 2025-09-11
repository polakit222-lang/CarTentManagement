package setupdata

import (
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// CreatePayments สร้างข้อมูล Payment ตัวอย่าง
func CreatePayments(db *gorm.DB) {
	// ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่ เพื่อไม่ให้สร้างซ้ำ
	var count int64
	db.Model(&entity.Payment{}).Count(&count)
	if count > 0 {
		return
	}

	salesContract1 := uint(1)
	salesContract2 := uint(2)
	salesContract3 := uint(3)
	// สร้างข้อมูล Payment ตัวอย่าง
	payments := []entity.Payment{
		{
			Amount:          "150000.00",
			PaymentDate:     time.Now().Add(-24 * time.Hour),
			Status:          "ชำระแล้ว",
			CustomerID:      1,
			EmployeeID:      1,
			SalesContractID: salesContract1,
			PaymentMethodID: 1, // กำหนด ID ของ PaymentMethod
		},
		{
			Amount:          "250000.00",
			PaymentDate:     time.Now().Add(-48 * time.Hour),
			Status:          "รอดำเนินการ",
			CustomerID:      1,
			EmployeeID:      2,
			SalesContractID: salesContract2,
			PaymentMethodID: 2,
		},
		{
			Amount:          "5000.00",
			PaymentDate:     time.Now().Add(-72 * time.Hour),
			Status:          "ชำระแล้ว",
			CustomerID:      1,
			EmployeeID:      1,
			SalesContractID:  salesContract3, // ตัวอย่างสำหรับสัญญาเช่า
			PaymentMethodID: 1,
		},
	}

	for _, payment := range payments {
		db.Create(&payment)
	}
}

// ฟังก์ชันช่วยเหลือเพื่อสร้าง pointer ของ uint
func uintPtr(n uint) *uint {
	return &n
}