package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
)

func main() {
	db, err := gorm.Open(sqlite.Open("car_full_data.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// AutoMigrate
	err = db.AutoMigrate(
		&entity.Brand{},
		&entity.CarModel{},
		&entity.SubModel{},
		&entity.Detail{},
		&entity.Car{},
	)
	if err != nil {
		log.Fatal("failed to migrate database:", err)
	}

	// อ่าน CSV และ insert
	insertFromCSV(db, "car_full_data.csv")
}

func insertFromCSV(db *gorm.DB, filepath string) {
	file, err := os.Open(filepath)
	if err != nil {
		log.Fatal("cannot open CSV file:", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	rows, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	for i, row := range rows {
		if i == 0 {
			continue // skip header
		}

		brandName := row[0]
		modelName := row[1]
		subModelName := row[2]

		// Check or create Brand
		var brand entity.Brand
		db.Where("brand_name = ?", brandName).FirstOrCreate(&brand, entity.Brand{BrandName: brandName})

		// Check or create CarModel
		var carModel entity.CarModel
		db.Where("model_name = ? AND brand_id = ?", modelName, brand.ID).
			FirstOrCreate(&carModel, entity.CarModel{ModelName: modelName, BrandID: brand.ID})

		// Check or create SubModel
		var subModel entity.SubModel
		db.Where("sub_model_name = ? AND car_model_id = ?", subModelName, carModel.ID).
			FirstOrCreate(&subModel, entity.SubModel{SubModelName: subModelName, CarModelID: carModel.ID})

		// Create or get Detail
		var detail entity.Detail
		db.Where("brand_id = ? AND car_model_id = ? AND sub_model_id = ?", brand.ID, carModel.ID, subModel.ID).
			FirstOrCreate(&detail, entity.Detail{
				BrandID:    brand.ID,
				CarModelID: carModel.ID,
				SubModelID: subModel.ID,
			})

		// Map other columns for Car
		yearManufacture := 0
		fmt.Sscanf(row[4], "%d", &yearManufacture)

		purchasePrice := 0.0
		fmt.Sscanf(row[5], "%f", &purchasePrice)

		purchaseDate, _ := time.Parse("2006-01-02", row[6]) // format yyyy-mm-dd

		provinceID := 0
		fmt.Sscanf(row[8], "%d", &provinceID)

		employeeID := 0
		fmt.Sscanf(row[9], "%d", &employeeID)

		car := entity.Car{
			CarName:         row[3],
			YearManufacture: yearManufacture,
			PurchasePrice:   purchasePrice,
			PurchaseDate:    purchaseDate,
			Color:           row[7],
			ProvinceID:      uint(provinceID), // แปลง int -> uint
			DetailID:        detail.ID,
			EmployeeID:      uint(employeeID), // แปลง int -> uint
		}

		db.Create(&car)
	}

	fmt.Println("Inserted CSV data successfully!")
}
