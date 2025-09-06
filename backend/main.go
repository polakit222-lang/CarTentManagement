// backend/main.go
package main

import (
	"log"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/configs"
	"github.com/PanuAutawo/CarTentManagement/backend/controllers"
	"github.com/PanuAutawo/CarTentManagement/backend/middleware"
	"github.com/PanuAutawo/CarTentManagement/backend/setupdata"
	"github.com/gin-contrib/cors" // <--- เพิ่ม import cors
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Connect DB
	configs.ConnectDatabase("car_full_data.db")

	// 2. Insert mock data (เรียงลำดับตามความสำคัญ)
	setupdata.InsertMockManagers(configs.DB)
	setupdata.InsertMockEmployees(configs.DB)
	setupdata.InsertProvinces(configs.DB)
	setupdata.InsertHardcodedAddressData(configs.DB) // ใช้ hardcoded แทนไฟล์ json
	setupdata.InsertCarsFromCSV(configs.DB, "car_full_data.csv")
	setupdata.InsertMockPictures(configs.DB)
	setupdata.InsertMockSaleList(configs.DB)
	setupdata.InsertMockRentListWithDates(configs.DB)
	setupdata.InsertCarSystems(configs.DB)
	setupdata.InsertTypeInformations(configs.DB)
	setupdata.InsertMockInspections(configs.DB)      // สร้าง Customer และ SalesContract จำลอง
	setupdata.InsertMockPickupDelivery(configs.DB) // สร้าง PickupDelivery จำลอง

	// 3. Create router
	r := gin.Default()
	// Use CORS middleware
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"}, // URL ของ Frontend (Vite)
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))
    // ^^^^ --- สิ้นสุดส่วนที่เพิ่ม --- ^^^^
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
    managerController := controllers.NewManagerController(configs.DB) // เพิ่ม Manager Controller

	// --- Routes ---

	// Public Routes (ไม่ต้อง Login)
	r.POST("/register", customerController.RegisterCustomer)
	r.POST("/login", customerController.LoginCustomer)
	r.POST("/employee/login", employeeController.LoginEmployee)
    r.POST("/manager/login", managerController.LoginManager) // เพิ่ม endpoint สำหรับ Manager

	// Car Routes (ข้อมูลรถยนต์ อาจจะ public)
	carRoutes := r.Group("/cars")
	{
		carRoutes.GET("", carController.GetCars)
		carRoutes.GET("/:id", carController.GetCarByID)
	}

	// Address Routes (ข้อมูลที่อยู่, public)
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

	// VVVV --- เพิ่มส่วนของ Car System Routes ที่หายไป --- VVVV
	carSystemRoutes := r.Group("/car-systems")
	{
		carSystemRoutes.GET("", carSystemController.GetCarSystems)
	}
	// ^^^^ --- สิ้นสุดส่วนที่เพิ่มเข้ามา --- ^^^^

	// Protected Customer Routes (ลูกค้าที่ Login แล้ว)
	customerRoutes := r.Group("/customers")
	customerRoutes.Use(middleware.CustomerAuthMiddleware())
	{
		customerRoutes.GET("/me", customerController.GetCurrentCustomer)
		// เพิ่ม Routes ที่ต้องใช้สิทธิ์ลูกค้าที่นี่ เช่น สร้างการนัดหมาย
	}

	// Protected Employee Routes (พนักงานที่ Login แล้ว)
	employeeRoutes := r.Group("/employee")
	employeeRoutes.Use(middleware.EmployeeAuthMiddleware())
	{
		employeeRoutes.GET("/me", employeeController.GetCurrentEmployee)
		// เพิ่ม Routes ที่ต้องใช้สิทธิ์พนักงานที่นี่
	}

	// Inspection Appointment Routes (อาจจะต้องใช้สิทธิ์พนักงาน)
	inspectionRoutes := r.Group("/inspection-appointments")
	// inspectionRoutes.Use(middleware.EmployeeAuthMiddleware()) // ถ้าต้องการให้พนักงานจัดการเท่านั้น
	{
		inspectionRoutes.GET("", inspectionAppointmentController.GetInspectionAppointments)
		inspectionRoutes.GET("/:id", inspectionAppointmentController.GetInspectionAppointmentByID)
		inspectionRoutes.GET("/customer/:customerID", inspectionAppointmentController.GetInspectionAppointmentsByCustomerID)
		inspectionRoutes.POST("", inspectionAppointmentController.CreateInspectionAppointment)
		inspectionRoutes.PUT("/:id", inspectionAppointmentController.UpdateInspectionAppointment)
		inspectionRoutes.PATCH("/:id/status", inspectionAppointmentController.UpdateInspectionAppointmentStatus)
		inspectionRoutes.DELETE("/:id", inspectionAppointmentController.DeleteInspectionAppointment)
	}

	// Pickup Delivery Routes
	pickupDeliveryRoutes := r.Group("/pickup-deliveries")
	{
		pickupDeliveryRoutes.GET("", pickupDeliveryController.GetPickupDeliveries)
		pickupDeliveryRoutes.GET("/customer/:customerID", pickupDeliveryController.GetPickupDeliveriesByCustomerID)
		pickupDeliveryRoutes.POST("", pickupDeliveryController.CreatePickupDelivery)
		pickupDeliveryRoutes.PUT("/:id", pickupDeliveryController.UpdatePickupDelivery)
		pickupDeliveryRoutes.PATCH("/:id/status", pickupDeliveryController.UpdatePickupDeliveryStatus)
		pickupDeliveryRoutes.DELETE("/:id", pickupDeliveryController.DeletePickupDelivery)
	}

	// Admin-Only Routes (สำหรับจัดการข้อมูลหลังบ้าน)

	adminEmployeeRoutes := r.Group("/admin/employees")
	// adminEmployeeRoutes.Use(middleware.AdminAuthMiddleware()) // ควรมี Middleware สำหรับ Admin/Manager ในอนาคต
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

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to run server:", err)
	}
}