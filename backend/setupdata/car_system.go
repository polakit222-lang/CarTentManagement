package setupdata

import (
	"log"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// InsertCarSystems เพิ่มข้อมูลระบบรถยนต์เริ่มต้น
func InsertCarSystems(db *gorm.DB) {
	// รายการระบบรถยนต์ที่ต้องการเพิ่ม
	carSystems := []entity.CarSystem{
		{SystemName: "ยางและระบบช่วงล่างรถยนต์"},
		{SystemName: "ระบบเบรก"},
		{SystemName: "ระบบแอร์และหม้อน้ำ"},
		{SystemName: "ไฟหน้าและไฟท้าย"},
		{SystemName: "น้ำมันเครื่องและไส้กรอง"},
		{SystemName: "แบตเตอรี่"},
		{SystemName: "ของเหลวต่างๆ"},
		{SystemName: "ไฟส่องสว่าง"},
	}

	// วนลูปเพื่อเพิ่มข้อมูลทีละรายการ
	for _, system := range carSystems {
		// ตรวจสอบก่อนว่ามีข้อมูลนี้อยู่แล้วหรือไม่
		var existingSystem entity.CarSystem
		if err := db.Where("system_name = ?", system.SystemName).First(&existingSystem).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// ถ้าไม่พบข้อมูล ให้สร้างใหม่
				if err := db.Create(&system).Error; err != nil {
					log.Printf("Failed to insert car system: %v, error: %v", system.SystemName, err)
				}
			}
		}
	}

	log.Println("Car systems data inserted successfully.")
}