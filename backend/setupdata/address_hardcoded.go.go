package setupdata

import (
	"log"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// InsertHardcodedAddressData เพิ่มข้อมูลอำเภอและตำบล (ตัวอย่าง กทม.)
func InsertHardcodedAddressData(db *gorm.DB) {
	// ตรวจสอบว่ามีข้อมูลอำเภออยู่แล้วหรือไม่ ถ้ามีให้ข้าม
	var count int64
	db.Model(&entity.District{}).Count(&count)
	if count > 0 {
		log.Println("Address data (Districts and Sub-districts) already exists. Skipping insertion.")
		return
	}

	log.Println("Start inserting hardcoded address data...")

	// 1. ดึง ID ของจังหวัดกรุงเทพมหานคร (แก้ไขชื่อตรงนี้)
	var bkkProvince entity.Province
	// VVVV --- แก้ไขจาก "กรุงเทพมหานคร" เป็น "กรุงเทพฯ" --- VVVV
	if err := db.Where("province_name = ?", "Bangkok").First(&bkkProvince).Error; err != nil {
		log.Printf("Bangkok province not found. Skipping address insertion. Error: %v", err)
		return
	}

	// 2. ข้อมูลอำเภอและตำบล (ตัวอย่าง)
	addressData := map[string][]string{
		"ปทุมวัน":   {"ปทุมวัน", "รองเมือง", "วังใหม่", "ลุมพินี"},
		"บางรัก":    {"บางรัก", "สี่พระยา", "มหาพฤฒาราม", "สีลม", "สุริยวงศ์"},
		"วัฒนา":     {"คลองเตยเหนือ", "คลองตันเหนือ", "พระโขนงเหนือ"},
		"จตุจักร":  {"จตุจักร", "ลาดยาว", "เสนานิคม", "จันทรเกษม", "จอมพล"},
	}

	tx := db.Begin()

	// 3. วนลูปสร้างข้อมูล
	for districtName, subDistrictNames := range addressData {
		// สร้างอำเภอ (District)
		district := entity.District{
			DistrictName: districtName,
			ProvinceID:   bkkProvince.ID,
		}
		if err := tx.Where(entity.District{DistrictName: districtName, ProvinceID: bkkProvince.ID}).FirstOrCreate(&district).Error; err != nil {
			log.Printf("Failed to create district %s: %v", districtName, err)
			tx.Rollback()
			return
		}

		// สร้างตำบล (SubDistrict)
		for _, subDistrictName := range subDistrictNames {
			subDistrict := entity.SubDistrict{
				SubDistrictName: subDistrictName,
				DistrictID:      district.ID,
			}
			if err := tx.Where(entity.SubDistrict{SubDistrictName: subDistrictName, DistrictID: district.ID}).FirstOrCreate(&subDistrict).Error; err != nil {
				log.Printf("Failed to create sub-district %s: %v", subDistrictName, err)
				tx.Rollback()
				return
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("Failed to commit address data: %v", err)
		tx.Rollback()
		return
	}

	log.Println("Hardcoded address data inserted successfully.")
}