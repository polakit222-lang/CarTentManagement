package entity

import (
	"time"

	"gorm.io/gorm"
)

type LeaveRequest struct {
	gorm.Model

	StartDate time.Time `json:"stardate"`
	EndDate   time.Time `json:"enddate"`
	Reason    string    `json:"reason"`
	Status    string    `json:"status"`

	EmployeeID uint      `json:"employeeID"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`
}
