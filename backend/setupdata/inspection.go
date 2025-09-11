package setupdata

import (
	"log"
	"time"
	"golang.org/x/crypto/bcrypt"
	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// InsertMockInspections สร้างข้อมูลจำลองสำหรับสัญญาและการนัดตรวจสภาพรถ
func InsertMockInspections(db *gorm.DB) {
	// --- 1. สร้างข้อมูลลูกค้า (ถ้ายังไม่มี) ---
	// ลูกค้าคนที่ 1: สมหญิง สมหญิง
	hashedPasswordSomying, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("failed to hash password: %v", err)
	}

	customerSomying := entity.Customer{
		FirstName:     "สมหญิง",
		LastName:     "สมหญิง",
		Email:    "somying.jj@example.com",
		Password: string(hashedPasswordSomying),
		Phone:      "0887654321",
		Birthday:	"2025-01-15",
	}
	db.Where(entity.Customer{Email: customerSomying.Email}).FirstOrCreate(&customerSomying)

	// ลูกค้าคนที่ 2: John Doe
	hashedPasswordJohn, err := bcrypt.GenerateFromPassword([]byte("john1999"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("failed to hash password for John Doe: %v", err)
	}
	customerJohn := entity.Customer{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "john@example.com",
		Password:  string(hashedPasswordJohn),
		Phone:     "0987654321",
		Birthday:  "2025-08-21",
	}
	db.Where(entity.Customer{Email: customerJohn.Email}).FirstOrCreate(&customerJohn)

	// --- 2. สร้างข้อมูลสัญญาซื้อขาย (SalesContract) โดยอ้างอิงจาก SaleList ---
	// สมมติว่า InsertMockSaleList ได้สร้าง SaleList ที่มี ID = 1 ไว้แล้ว
	salesContractID := uint(1)

	// --- 3. สร้างข้อมูลการนัดตรวจสภาพรถ (InspectionAppointment) ---
	// ตรวจสอบก่อนว่ามีการนัดหมายของสัญญานี้หรือยัง
	var existingAppointment entity.InspectionAppointment
	if err := db.Where("sales_contract_id = ?", salesContractID).First(&existingAppointment).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// ถ้าไม่พบ ให้สร้างการนัดหมายใหม่
			// แปลง string เป็น time.Time
			appointmentTime, err := time.Parse(time.RFC3339, "2025-09-11T11:00:00Z")
			if err != nil {
				log.Fatalf("failed to parse appointment time: %v", err)
			}
			appointment := entity.InspectionAppointment{
				CustomerID:      customerSomying.ID, // ใช้ customerSomying.ID สำหรับการนัดหมายนี้
				Note:            "นัดตรวจเช็คสภาพก่อนรับรถตามสัญญา",
				DateTime:        appointmentTime,
				SalesContractID: salesContractID,
				InspectionStatus: "กำลังดำเนินการ",
			}
			db.Create(&appointment)

			// --- 4. เชื่อมโยงการนัดหมายกับระบบรถยนต์ (InspectionSystem) ---
			carSystemIDs := []uint{1, 2, 4, 5}
			for _, systemID := range carSystemIDs {
				inspectionSystem := entity.InspectionSystem{
					InspectionAppointmentID: appointment.ID,
					CarSystemID:             systemID,
				}
				db.Create(&inspectionSystem)
			}
			log.Println("Mock inspection appointment created successfully.")
		}
	} else {
		log.Println("Mock inspection appointment already exists.")
	}
}