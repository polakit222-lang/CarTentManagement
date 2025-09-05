package setupdata

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// InsertMockRentList สร้าง RentList mock ให้รถแต่ละคัน 1 รายการ
func InsertMockRentList(db *gorm.DB) {
	// ดึงรถทั้งหมด
	var cars []entity.Car
	if err := db.Find(&cars).Error; err != nil {
		fmt.Println("ไม่สามารถดึงข้อมูลรถ:", err)
		return
	}
	if len(cars) == 0 {
		fmt.Println("ไม่พบรถในระบบ -> ยัง insert RentList ไม่ได้")
		return
	}

	// ดึงพนักงานคนแรก (สำหรับ Rent Coordinator / Employee)
	var emp entity.Employee
	if err := db.First(&emp).Error; err != nil {
		fmt.Println("ไม่พบพนักงาน -> ยัง insert RentList ไม่ได้")
		return
	}

	// ดึง Manager ทั้งหมด
	var managers []entity.Manager
	if err := db.Find(&managers).Error; err != nil || len(managers) == 0 {
		fmt.Println("ไม่พบ Manager -> ยัง insert RentList ไม่ได้")
		return
	}

	rand.Seed(time.Now().UnixNano())

	// จำกัดสูงสุด 20 คัน
	limit := 20
	if len(cars) < limit {
		limit = len(cars)
	}

	for i := 0; i < limit; i++ {
		car := cars[i]

		// สุ่มค่า RentPrice 1–5% ของ PurchasePrice
		rentPrice := car.PurchasePrice * (0.01 + rand.Float64()*0.04)

		// สุ่มสถานะ
		status := "Available"
		if rand.Intn(3) == 0 {
			status = "Rented"
		}

		// สุ่ม Manager
		manager := managers[rand.Intn(len(managers))]

		rent := entity.RentList{
			CarID:      car.ID,
			Status:     status,
			RentPreice: rentPrice,
			ManagerID:  manager.ID,
		}

		db.Create(&rent)
	}

	fmt.Printf("Inserted mock RentList successfully! (%d records)\n", limit)
}
