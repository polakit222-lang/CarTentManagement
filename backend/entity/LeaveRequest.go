package entity

<<<<<<< HEAD
import (
	"time"
	"gorm.io/gorm"
)

type LeaveRequest struct {
	gorm.Model

	StartDate  time.Time    `json:"startdate"`
	EndDate    time.Time    `json:"enddate"`
	Reason     string    	`json:"reason"`
	Status     string    	`json:"status"`

=======
import "gorm.io/gorm"

type LeaveRequest struct {
	gorm.Model
	LeaveID    string    `json:"leaveID" gorm:"uniqueIndex"`
	StartDate  string    `json:"startDate"`
	EndDate    string    `json:"endDate"`
	Type       string    `json:"type"`
	Status     string    `json:"status"`
>>>>>>> upstream/main
	EmployeeID uint      `json:"employeeID"`
	Employee   *Employee `json:"employee,omitempty" gorm:"foreignKey:EmployeeID;references:EmployeeID"`
}
