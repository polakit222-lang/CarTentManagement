// package setup_data

// import (
// 	"time"

// 	"github.com/PanuAutawo/CarTentManagement/backend/entity"
// )

// func GetSampleCars() ([]*entity.Car, []*entity.Brand, []*entity.CarModel, []*entity.SubModel, []*entity.Detail) {
// 	brands := []*entity.Brand{
// 		{BrandName: "Toyota"},
// 		{BrandName: "Honda"},
// 		{BrandName: "Ford"},
// 		{BrandName: "Chevrolet"},
// 	}

// 	models := []*entity.CarModel{
// 		{ModelName: "Yaris", BrandID: 1},
// 		{ModelName: "Civic", BrandID: 2},
// 		{ModelName: "Mustang", BrandID: 3},
// 		{ModelName: "Camaro", BrandID: 4},
// 	}

// 	subModels := []*entity.SubModel{
// 		{SubModelName: "Yaris ATIV", ModelID: 1},
// 		{SubModelName: "Civic Turbo", ModelID: 2},
// 		{SubModelName: "Mustang GT", ModelID: 3},
// 		{SubModelName: "Camaro SS", ModelID: 4},
// 	}

// 	details := []*entity.Detail{
// 		{BrandID: 1, ModelID: 1, SubModelID: 1},
// 		{BrandID: 2, ModelID: 2, SubModelID: 2},
// 		{BrandID: 3, ModelID: 3, SubModelID: 3},
// 		{BrandID: 4, ModelID: 4, SubModelID: 4},
// 	}

// 	cars := []*entity.Car{
// 		{YearManufacture: 2020, PurchasePrice: 550000, PurchaseDate: time.Date(2023, 10, 26, 14, 30, 0, 0, time.Local), Color: "Red", ProvinceID: 1, DetailID: 1, EmployeeID: 1},
// 		{YearManufacture: 2021, PurchasePrice: 580000, PurchaseDate: time.Date(2023, 11, 5, 10, 0, 0, 0, time.Local), Color: "Blue", ProvinceID: 2, DetailID: 2, EmployeeID: 2},
// 		{YearManufacture: 2019, PurchasePrice: 450000, PurchaseDate: time.Date(2023, 9, 12, 9, 15, 0, 0, time.Local), Color: "Black", ProvinceID: 3, DetailID: 3, EmployeeID: 1},
// 		{YearManufacture: 2022, PurchasePrice: 750000, PurchaseDate: time.Date(2023, 12, 1, 16, 45, 0, 0, time.Local), Color: "White", ProvinceID: 1, DetailID: 4, EmployeeID: 3},
// 		{YearManufacture: 2020, PurchasePrice: 560000, PurchaseDate: time.Date(2023, 10, 30, 11, 0, 0, 0, time.Local), Color: "Gray", ProvinceID: 2, DetailID: 1, EmployeeID: 2},
// 		{YearManufacture: 2021, PurchasePrice: 600000, PurchaseDate: time.Date(2023, 11, 15, 14, 20, 0, 0, time.Local), Color: "Silver", ProvinceID: 3, DetailID: 2, EmployeeID: 1},
// 		{YearManufacture: 2018, PurchasePrice: 400000, PurchaseDate: time.Date(2023, 8, 20, 10, 30, 0, 0, time.Local), Color: "Green", ProvinceID: 1, DetailID: 3, EmployeeID: 3},
// 		{YearManufacture: 2022, PurchasePrice: 780000, PurchaseDate: time.Date(2023, 12, 5, 12, 0, 0, 0, time.Local), Color: "Yellow", ProvinceID: 2, DetailID: 4, EmployeeID: 2},
// 		{YearManufacture: 2020, PurchasePrice: 570000, PurchaseDate: time.Date(2023, 10, 28, 9, 45, 0, 0, time.Local), Color: "Red", ProvinceID: 3, DetailID: 1, EmployeeID: 1},
// 		{YearManufacture: 2021, PurchasePrice: 590000, PurchaseDate: time.Date(2023, 11, 20, 15, 0, 0, 0, time.Local), Color: "Blue", ProvinceID: 1, DetailID: 2, EmployeeID: 3},
// 	}

// 	return cars, brands, models, subModels, details
// }
