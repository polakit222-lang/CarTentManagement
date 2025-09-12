package setupdata

import (
	"math/rand"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// InsertMockRentListWithDates สร้าง RentList + DateforRent + RentAbleDate
func InsertMockRentListWithDates(db *gorm.DB) {
	var cars []entity.Car
	db.Find(&cars)
	var managers []entity.Manager
	db.Find(&managers)

	for _, car := range cars[:10] {
		manager := managers[rand.Intn(len(managers))]
		status := "Available"
		if rand.Intn(3) == 0 {
			status = "Rented"
		}

		rentList := entity.RentList{
			CarID:     car.ID,
			Status:    status,
			ManagerID: manager.ID,
		}
		db.Create(&rentList)

		numDates := 1 + rand.Intn(3)
		for j := 0; j < numDates; j++ {
			open := time.Now().AddDate(0, 0, rand.Intn(30))
			close := open.AddDate(0, 0, 1+rand.Intn(7))
			price := car.PurchasePrice * (0.01 + 0.04*rand.Float64())

			date := entity.DateforRent{
				OpenDate:  open,
				CloseDate: close,
				RentPrice: price,
			}
			db.Create(&date)
			db.Create(&entity.RentAbleDate{
				RentListID:    rentList.ID,
				DateforRentID: date.ID,
			})
		}
	}
}
