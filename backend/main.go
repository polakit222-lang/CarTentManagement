package main

import (
	"log"

	"github.com/PanuAutawo/CarTentManagement/backend/configs"
	"github.com/PanuAutawo/CarTentManagement/backend/controllers"
	"github.com/PanuAutawo/CarTentManagement/backend/setupdata"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Connect DB
	configs.ConnectDatabase("car_full_data.db")

	// 2. Insert mock data
	setupdata.InsertMockManagers(configs.DB)
	setupdata.InsertMockEmployees(configs.DB)
	setupdata.InsertProvinces(configs.DB)
	setupdata.InsertCarsFromCSV(configs.DB, "car_full_data.csv")
	setupdata.InsertMockPictures(configs.DB)
	setupdata.InsertMockSaleList(configs.DB)
	setupdata.InsertMockRentListWithDates(configs.DB)

	// 3. Create router
	r := gin.Default()

	// 4. Car Controller
	carController := controllers.NewCarController(configs.DB)

	// 5. Car routes
	carRoutes := r.Group("/cars")
	{
		carRoutes.GET("", carController.GetCars)          // GET /cars
		carRoutes.GET("/:id", carController.GetCarByID)   // GET /cars/1
		carRoutes.POST("", carController.CreateCar)       // POST /cars
		carRoutes.PUT("/:id", carController.UpdateCar)    // PUT /cars/1
		carRoutes.DELETE("/:id", carController.DeleteCar) // DELETE /cars/1
	}

	// 6. Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to run server:", err)
	}
}
