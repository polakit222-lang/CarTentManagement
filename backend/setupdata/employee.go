// backend/setupdata/employee.go
package setupdata

import (
	"fmt"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func InsertMockEmployees(db *gorm.DB) {
	// Hash password
	hashedPassword1, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	hashedPassword2, _ := bcrypt.GenerateFromPassword([]byte("abcdef"), bcrypt.DefaultCost)

	employees := []entity.Employee{
		{
			ProfileImage: "employee1.jpg",
			FirstName:    "Somchai",
			LastName:     "Sukjai",
			Password:     string(hashedPassword1),
			Email:        "somchai@example.com",
			PhoneNumber:  "0812345678",
			Address:      "Bangkok, Thailand",
			Birthday:     time.Date(1990, 5, 10, 0, 0, 0, 0, time.UTC),
			Sex:          "Male",
			Position:     "Sales",
			Jobtype:      time.Now(),
		},
		{
			ProfileImage: "employee2.jpg",
			FirstName:    "Suda",
			LastName:     "Thongdee",
			Password:     string(hashedPassword2),
			Email:        "suda@example.com",
			PhoneNumber:  "0899998888",
			Address:      "Chiang Mai, Thailand",
			Birthday:     time.Date(1995, 11, 20, 0, 0, 0, 0, time.UTC),
			Sex:          "Female",
			Position:     "Programmer",
			Jobtype:      time.Now(),
		},
	}

	for _, e := range employees {
		db.FirstOrCreate(&e, entity.Employee{Email: e.Email})
	}
	fmt.Println("Inserted mock Employees successfully!")
}