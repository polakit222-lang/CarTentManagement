package setupdata

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

func InsertCarsFromCSV(db *gorm.DB, filepath string) {
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
			continue
		}

		brandName := row[0]
		modelName := row[1]
		subModelName := row[2]

		var brand entity.Brand
		db.Where("brand_name = ?", brandName).FirstOrCreate(&brand, entity.Brand{BrandName: brandName})

		var carModel entity.CarModel
		db.Where("model_name = ? AND brand_id = ?", modelName, brand.ID).
			FirstOrCreate(&carModel, entity.CarModel{ModelName: modelName, BrandID: brand.ID})

		var subModel entity.SubModel
		db.Where("sub_model_name = ? AND car_model_id = ?", subModelName, carModel.ID).
			FirstOrCreate(&subModel, entity.SubModel{SubModelName: subModelName, CarModelID: carModel.ID})

		var detail entity.Detail
		db.Where("brand_id = ? AND car_model_id = ? AND sub_model_id = ?", brand.ID, carModel.ID, subModel.ID).
			FirstOrCreate(&detail, entity.Detail{
				BrandID:    brand.ID,
				CarModelID: carModel.ID,
				SubModelID: subModel.ID,
			})

		yearManufacture := 0
		fmt.Sscanf(row[4], "%d", &yearManufacture)

		purchasePrice := 0.0
		fmt.Sscanf(row[5], "%f", &purchasePrice)

		purchaseDate, _ := time.Parse("2006-01-02", row[6])

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
			ProvinceID:      uint(provinceID),
			DetailID:        detail.ID,
			EmployeeID:      uint(employeeID),
		}

		db.Create(&car)
	}

	fmt.Println("Inserted CSV Car data successfully!")
}
func InsertMockPictures(db *gorm.DB) {
	// ดึงรถทั้งหมด
	var cars []entity.Car
	db.Find(&cars)

	for _, car := range cars {
		// สร้างรูป mock 3 รูปสำหรับแต่ละคัน
		pictures := []entity.CarPicture{
			{Title: "Front view", Path: "/mockimages/car_front.jpg", CarID: car.ID},
			{Title: "Side view", Path: "/mockimages/car_side.jpg", CarID: car.ID},
			{Title: "Interior", Path: "/mockimages/car_interior.jpg", CarID: car.ID},
		}

		for _, pic := range pictures {
			db.Create(&pic)
		}
	}

	fmt.Println("Inserted mock pictures for all cars successfully!")
}
