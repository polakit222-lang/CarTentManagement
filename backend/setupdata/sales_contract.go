package setupdata

import (
	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

func CreateSalesContracts(db *gorm.DB) {
	// ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่ เพื่อไม่ให้สร้างซ้ำ
	var count int64
	db.Model(&entity.SalesContract{}).Count(&count)
	if count > 0 {
		return
	}

	// สร้างข้อมูล SalesContract ตัวอย่าง
	// **หมายเหตุ:** คุณต้องมั่นใจว่ามีข้อมูล SaleList, Employee, และ Customer ที่มี ID ตรงกันอยู่แล้วในระบบ
	contracts := []entity.SalesContract{
		{
			SaleListID: 1,
			EmployeeID: 1,
			CustomerID: 1,
		},
		{
			SaleListID: 2,
			EmployeeID: 2,
			CustomerID: 1,
		},
		{
			SaleListID: 3,
			EmployeeID: 1,
			CustomerID: 2,
		},
	}

	for _, contract := range contracts {
		db.Create(&contract)
	}
}