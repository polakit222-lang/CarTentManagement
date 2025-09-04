package configs

import (
	"example.com/go-example-api/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetDB() *gorm.DB {
	return db
}

func ConnectDB() {
	database, err := gorm.Open(sqlite.Open("car.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.Brand{},
		&entity.Car{},
		&entity.Company{},
		&entity.Condition{},
		&entity.Detail{},
		&entity.Employee{},
		&entity.Image{},
		&entity.Insurance{},
		&entity.InsuranceStatus{},
		&entity.Model{},
		&entity.SubModel{},
		&entity.Plan{},
		&entity.InsurancePrice{},
		&entity.PriceInsurance{},
		&entity.Province{},
		&entity.Repair{},
		&entity.SalesContract{},
		&entity.Type{},
	)

	
}