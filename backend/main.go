package main

import (
	"usedcartent/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("CarTent2.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(
		&entity.Car{},
		&entity.Province{},
		&entity.TypeInformation{},
		&entity.SaleContract{},
		&entity.District{},
		&entity.SubDistrict{},
		&entity.PickupDelivery{},
		&entity.Customer{},
		&entity.Employee{},
		&entity.SaleList{},
		&entity.Manager{},
		&entity.InspectionAppointment{},
		&entity.InspectionSystem{},
		&entity.CarSystem{},
	)

}