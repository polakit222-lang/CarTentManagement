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
	setupdata.InsertHardcodedAddressData(configs.DB)
	setupdata.InsertCarsFromCSV(configs.DB, "car_full_data.csv")
	setupdata.InsertMockPictures(configs.DB)
	setupdata.InsertMockSaleList(configs.DB)
	setupdata.InsertMockRentListWithDates(configs.DB)
	setupdata.InsertCarSystems(configs.DB)
	setupdata.InsertMockInspections(configs.DB)
	setupdata.InsertTypeInformations(configs.DB)         // ✨ เพิ่มเข้ามา: ประเภทการรับรถ
	setupdata.InsertMockPickupDelivery(configs.DB)   

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
	// 6. Inspection Appointment Controller
	inspectionAppointmentController := controllers.NewInspectionAppointmentController(configs.DB)

	// 7. Inspection Appointment routes
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
	
	// 8. Car System Controller
	carSystemController := controllers.NewCarSystemController(configs.DB)

	// 9. Car System routes
	carSystemRoutes := r.Group("/car-systems")
	{
		carSystemRoutes.GET("", carSystemController.GetCarSystems)
	}
	// 10. Pickup Delivery Controller
	pickupDeliveryController := controllers.NewPickupDeliveryController(configs.DB)

	// 11. Pickup Delivery routes
	pickupDeliveryRoutes := r.Group("/pickup-deliveries")
	{
		pickupDeliveryRoutes.GET("", pickupDeliveryController.GetPickupDeliveries)
		pickupDeliveryRoutes.GET("/customer/:customerID", pickupDeliveryController.GetPickupDeliveriesByCustomerID)
		pickupDeliveryRoutes.POST("", pickupDeliveryController.CreatePickupDelivery)
		pickupDeliveryRoutes.PUT("/:id", pickupDeliveryController.UpdatePickupDelivery)
		pickupDeliveryRoutes.PATCH("/:id/status", pickupDeliveryController.UpdatePickupDeliveryStatus)
		pickupDeliveryRoutes.DELETE("/:id", pickupDeliveryController.DeletePickupDelivery)
	}
	// 12. Type Information Controller
	typeInformationController := controllers.NewTypeInformationController(configs.DB)

	// 13. Type Information routes
	typeInfoRoutes := r.Group("/type-informations")
	{
		typeInfoRoutes.GET("", typeInformationController.GetTypeInformations)
	}
	// ✨ --- ส่วนที่เพิ่มเข้ามา --- ✨
	// 12. Address Controllers
	provinceController := controllers.NewProvinceController(configs.DB)
	districtController := controllers.NewDistrictController(configs.DB)
	subDistrictController := controllers.NewSubDistrictController(configs.DB)

	// 13. Address Routes
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
	// ✨ --- จบส่วนที่เพิ่มเข้ามา --- ✨

	// 6. Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to run server:", err)
	}
}
