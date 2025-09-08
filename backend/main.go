// backend/main.go
package main

import (
	"log"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/configs"
	"github.com/PanuAutawo/CarTentManagement/backend/controllers"
	"github.com/PanuAutawo/CarTentManagement/backend/middleware"
	"github.com/PanuAutawo/CarTentManagement/backend/setupdata"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Connect DB
	configs.ConnectDatabase("car_full_data.db")

	// 2. Insert mock data
	setupdata.InsertMockManagers(configs.DB)
	setupdata.InsertMockEmployees(configs.DB)
	setupdata.InsertProvinces(configs.DB)
	setupdata.InsertHardcodedAddressData(configs.DB)
	setupdata.InsertCarsFromCSV(configs.DB, "car_full_data.csv")
	setupdata.InsertMockSaleList(configs.DB)
	setupdata.InsertMockRentListWithDates(configs.DB)
	setupdata.InsertCarSystems(configs.DB)
	setupdata.InsertTypeInformations(configs.DB)
	setupdata.InsertMockInspections(configs.DB)
	setupdata.InsertMockPickupDelivery(configs.DB)

	// 3. Create router
	r := gin.Default()

	// ✅ CORS: อนุญาต frontend port 5173
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ✅ Serve static images
	r.Static("/images/cars", "./public/images/cars") // folder จริงต้องมีไฟล์รูป

	// --- Controllers Setup ---
	carController := controllers.NewCarController(configs.DB)
	inspectionAppointmentController := controllers.NewInspectionAppointmentController(configs.DB)
	carSystemController := controllers.NewCarSystemController(configs.DB)
	pickupDeliveryController := controllers.NewPickupDeliveryController(configs.DB)
	provinceController := controllers.NewProvinceController(configs.DB)
	districtController := controllers.NewDistrictController(configs.DB)
	subDistrictController := controllers.NewSubDistrictController(configs.DB)
	employeeController := controllers.NewEmployeeController(configs.DB)
	customerController := controllers.NewCustomerController(configs.DB)
	managerController := controllers.NewManagerController(configs.DB)
	saleListController := controllers.NewSaleListController(configs.DB)
	rentListController := controllers.NewRentListController(configs.DB)

	// --- Routes ---
	r.POST("/register", customerController.RegisterCustomer)
	r.POST("/login", customerController.LoginCustomer)
	r.POST("/employee/login", employeeController.LoginEmployee)
	r.POST("/manager/login", managerController.LoginManager)

	carRoutes := r.Group("/cars")
	{
		carRoutes.GET("", carController.GetCars)
		carRoutes.GET("/:id", carController.GetCarByID)
	}

	provinceRoutes := r.Group("/provinces")
	{
		provinceRoutes.GET("", provinceController.GetProvinces)
	}

	districtRoutes := r.Group("/districts")
	{
		districtRoutes.GET("/by-province/:provinceID", districtController.GetDistrictsByProvince)
	}

	subDistrictRoutes := r.Group("/sub-districts")
	{
		subDistrictRoutes.GET("/by-district/:districtID", subDistrictController.GetSubDistrictsByDistrict)
	}

	carSystemRoutes := r.Group("/car-systems")
	{
		carSystemRoutes.GET("", carSystemController.GetCarSystems)
	}

	customerRoutes := r.Group("/customers")
	customerRoutes.Use(middleware.CustomerAuthMiddleware())
	{
		customerRoutes.GET("/me", customerController.GetCurrentCustomer)
	}

	employeeRoutes := r.Group("/employee")
	employeeRoutes.Use(middleware.EmployeeAuthMiddleware())
	{
		employeeRoutes.GET("/me", employeeController.GetCurrentEmployee)
	}

	inspectionRoutes := r.Group("/inspection-appointments")
	{
		inspectionRoutes.GET("", inspectionAppointmentController.GetInspectionAppointments)
		inspectionRoutes.GET("/:id", inspectionAppointmentController.GetInspectionAppointmentByID)
		inspectionRoutes.GET("/customer/:customerID", inspectionAppointmentController.GetInspectionAppointmentsByCustomerID)
		inspectionRoutes.POST("", inspectionAppointmentController.CreateInspectionAppointment)
		inspectionRoutes.PUT("/:id", inspectionAppointmentController.UpdateInspectionAppointment)
		inspectionRoutes.PATCH("/:id/status", inspectionAppointmentController.UpdateInspectionAppointmentStatus)
		inspectionRoutes.DELETE("/:id", inspectionAppointmentController.DeleteInspectionAppointment)
	}

	pickupDeliveryRoutes := r.Group("/pickup-deliveries")
	{
		pickupDeliveryRoutes.GET("", pickupDeliveryController.GetPickupDeliveries)
		pickupDeliveryRoutes.GET("/customer/:customerID", pickupDeliveryController.GetPickupDeliveriesByCustomerID)
		pickupDeliveryRoutes.POST("", pickupDeliveryController.CreatePickupDelivery)
		pickupDeliveryRoutes.PUT("/:id", pickupDeliveryController.UpdatePickupDelivery)
		pickupDeliveryRoutes.PATCH("/:id/status", pickupDeliveryController.UpdatePickupDeliveryStatus)
		pickupDeliveryRoutes.DELETE("/:id", pickupDeliveryController.DeletePickupDelivery)
	}

	adminEmployeeRoutes := r.Group("/admin/employees")
	{
		adminEmployeeRoutes.GET("", employeeController.GetEmployees)
		adminEmployeeRoutes.GET("/:id", employeeController.GetEmployeeByID)
		adminEmployeeRoutes.POST("", employeeController.CreateEmployee)
		adminEmployeeRoutes.PUT("/:id", employeeController.UpdateEmployee)
		adminEmployeeRoutes.DELETE("/:id", employeeController.DeleteEmployee)
	}

	adminCustomerRoutes := r.Group("/admin/customers")
	{
		adminCustomerRoutes.GET("/:id", customerController.GetCustomerByID)
		adminCustomerRoutes.PUT("/:id", customerController.UpdateCustomer)
		adminCustomerRoutes.DELETE("/:id", customerController.DeleteCustomer)
	}

	r.GET("/salelists", saleListController.GetSaleLists)
	r.GET("/salelists/:id", saleListController.GetSaleListByID)
	r.POST("/salelists", saleListController.CreateSaleList)
	r.PUT("/salelists/:id", saleListController.UpdateSaleList)
	r.DELETE("/salelists/:id", saleListController.DeleteSaleList)

	rentListRoutes := r.Group("/rentlists")
	{
		rentListRoutes.GET("", rentListController.GetRentLists)
		rentListRoutes.GET("/:id", rentListController.GetRentListByID)
		rentListRoutes.POST("", rentListController.CreateRentList)
		rentListRoutes.PUT("/:id", rentListController.UpdateRentList)
		rentListRoutes.DELETE("/:id", rentListController.DeleteRentList)
		rentListRoutes.POST("/:id/rentable-dates", rentListController.AddRentAbleDate)
		rentListRoutes.GET("/:id/rentable-dates", rentListController.GetRentAbleDates)
	}

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to run server:", err)
	}
}
