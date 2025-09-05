package setupdata

import (
	"fmt"
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

func InsertMockEmployees(db *gorm.DB) {
	employees := []entity.Employee{
		{
			ProfileImage: "employee1.jpg",
			FirstName:    "Somchai",
			LastName:     "Sukjai",
			Password:     "123456",
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
			Password:     "abcdef",
			Email:        "suda@example.com",
			PhoneNumber:  "0899998888",
			Address:      "Chiang Mai, Thailand",
			Birthday:     time.Date(1995, 11, 20, 0, 0, 0, 0, time.UTC),
			Sex:          "Female",
			Position:     "Manager",
			Jobtype:      time.Now(),
		},
	}

	for _, emp := range employees {
		db.FirstOrCreate(&emp, entity.Employee{Email: emp.Email})
	}

	fmt.Println("Inserted mock employees successfully!")
}
