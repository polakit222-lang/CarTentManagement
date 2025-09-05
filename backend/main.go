package main

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/PanuAutawo/CarTentManagement/backend/setupdata"
)

func main() {
	db, err := gorm.Open(sqlite.Open("car_full_data.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// AutoMigrate
	err = db.AutoMigrate(
		&entity.Manager{},
		&entity.Employee{},
		&entity.Province{},
		&entity.Brand{},
		&entity.CarModel{},
		&entity.SubModel{},
		&entity.Detail{},
		&entity.Car{},
		&entity.SaleList{},
		&entity.RentList{},
		&entity.DateforRent{},  // <- เพิ่มตรงนี้
		&entity.RentAbleDate{}, // <- เพิ่มตรงนี้
	)
	if err != nil {
		log.Fatal(err)
	}

	// Insert mock data
	setupdata.InsertMockManagers(db) // ✅ เพิ่ม Manager
	setupdata.InsertMockEmployees(db)
	setupdata.InsertProvinces(db)
	setupdata.InsertCarsFromCSV(db, "car_full_data.csv")
	setupdata.InsertMockSaleList(db)
	setupdata.InsertMockRentListWithDates(db)
}
