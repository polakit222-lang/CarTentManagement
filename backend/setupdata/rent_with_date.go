package setupdata

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// InsertMockRentListWithDates สร้าง RentList + DateforRent + RentAbleDate
func InsertMockRentListWithDates(db *gorm.DB) {
	// ดึงรถทั้งหมด
	var cars []entity.Car
	if err := db.Find(&cars).Error; err != nil || len(cars) == 0 {
		fmt.Println("ไม่พบรถในระบบ -> ยัง insert RentList ไม่ได้")
		return
	}

	// ดึงพนักงานคนแรก
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

	limit := 10
	if len(cars) < limit {
		limit = len(cars)
	}

	for i := 0; i < limit; i++ {
		car := cars[i]

		// สุ่ม RentPrice 1–5% ของ PurchasePrice
		rentPrice := car.PurchasePrice * (0.01 + rand.Float64()*0.04)

		// สุ่มสถานะ
		status := "Available"
		if rand.Intn(3) == 0 {
			status = "Rented"
		}

		// สุ่ม Manager
		manager := managers[rand.Intn(len(managers))]

		// สร้าง RentList
		rent := entity.RentList{
			CarID:     car.ID,
			Status:    status,
			RentPrice: rentPrice,
			ManagerID: manager.ID,
		}
		db.Create(&rent)

		// สร้าง DateforRent หลายช่วงต่อรถ (1–3 ช่วง)
		numDates := 1 + rand.Intn(3)
		for j := 0; j < numDates; j++ {
			open := time.Now().AddDate(0, 0, rand.Intn(30)) // วันนี้ + 0–29 วัน
			close := open.AddDate(0, 0, 1+rand.Intn(7))     // 1–7 วัน
			date := entity.DateforRent{
				OpenDate:  open,
				CloseDate: close,
			}
			db.Create(&date)

			// สร้าง RentAbleDate
			rentAble := entity.RentAbleDate{
				RentListID:    rent.ID,
				DateforRentID: date.ID,
			}
			db.Create(&rentAble)
		}
	}

	fmt.Printf("Inserted mock RentList with DateforRent successfully! (%d cars)\n", limit)
}
