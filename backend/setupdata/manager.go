package setupdata

import (
	"fmt"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

// InsertMockManagers สร้างข้อมูล Manager ตัวอย่าง
func InsertMockManagers(db *gorm.DB) {
	managers := []entity.Manager{
		{
			Username:  "manager1",
			Email:     "manager1@example.com",
			Password:  "pass1234",
			FirstName: "Anan",
			LastName:  "Srisuk",
			Birthday:  time.Date(1985, 3, 15, 0, 0, 0, 0, time.UTC),
		},
		{
			Username:  "manager2",
			Email:     "manager2@example.com",
			Password:  "abc123",
			FirstName: "Somsak",
			LastName:  "Chaiyo",
			Birthday:  time.Date(1990, 7, 22, 0, 0, 0, 0, time.UTC),
		},
	}

	for _, m := range managers {
		// ถ้ามี Email อยู่แล้วจะไม่ insert ซ้ำ
		db.FirstOrCreate(&m, entity.Manager{Email: m.Email})
	}

	fmt.Println("Inserted mock Managers successfully!")
}
