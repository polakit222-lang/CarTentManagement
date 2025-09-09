// backend/setupdata/employee.go
package setupdata

import (
	"fmt"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	//"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func InsertMockEmployees(db *gorm.DB) {
	// Hash password
	//hashedPassword1, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	//hashedPassword2, _ := bcrypt.GenerateFromPassword([]byte("abcdef"), bcrypt.DefaultCost)

	employees := []entity.Employee{
		{
			ProfileImage: "employee1.jpg",
			FirstName:    "Somchai",
			LastName:     "Sukjai",
			Password:     "123456", //string(hashedPassword1),
			Email:        "somchai@example.com",
			Phone:        "0812345678", // ✅ แก้ชื่อ field
			Address:      "Bangkok, Thailand",
			Birthday:     time.Date(1990, 5, 10, 0, 0, 0, 0, time.UTC),
			Sex:          "Male",
			Position:     "Sales",
			JobType:      "full-time", // ✅ ใช้ชื่อ field ให้ตรง
		},
		{
			ProfileImage: "employee2.jpg",
			FirstName:    "Suda",
			LastName:     "Thongdee",
			Password:     "123456", //string(hashedPassword2),
			Email:        "suda@example.com",
			Phone:        "0899998888", // ✅ แก้ชื่อ field
			Address:      "Chiang Mai, Thailand",
			Birthday:     time.Date(1995, 11, 20, 0, 0, 0, 0, time.UTC),
			Sex:          "Female",
			Position:     "Programmer",
			JobType:      "full-time", // ✅ สะกดให้ตรงกัน
		},
	}

	for _, e := range employees {
		db.FirstOrCreate(&e, entity.Employee{Email: e.Email})
	}
	fmt.Println("Inserted mock Employees successfully!")
}
