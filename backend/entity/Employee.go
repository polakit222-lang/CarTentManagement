package entity

import "time"

type Employee struct {
	EmployeeID   uint      `json:"employeeID" gorm:"primaryKey;autoIncrement"`
	ProfileImage string    `json:"profileImage"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Password     string    `json:"-"` // ไม่ส่งออกไป frontend
	Email        string    `json:"email" gorm:"uniqueIndex"`
	Phone        string    `json:"phone"`
	Address      string    `json:"address"`
	Birthday     time.Time `json:"birthday"`
	Sex          string    `json:"sex"`
	Position     string    `json:"position"`
<<<<<<< HEAD
	Jobtype      string    `json:"jobtype"`
	TotalSales   string    `json:"total_sales"`
=======
	JobType      string    `json:"jobType"`
	TotalSales   string    `json:"totalSales"`
>>>>>>> upstream/main

	// ❌ ไม่เก็บใน DB แต่ส่งไป frontend ได้
	LeaveRequests  []LeaveRequest   `json:"leaves" gorm:"-"`
	PickupDelivery []PickupDelivery `gorm:"foreignKey:EmployeeID"`
	Car            []Car            `gorm:"foreignKey:EmployeeID"`
<<<<<<< HEAD
	SaleList      []SaleList      `gorm:"foreignKey:EmployeeID"`
	SalesContract []SalesContract `gorm:"foreignKey:EmployeeID"`
	LeaveRequest  []LeaveRequest  `gorm:"foreignKey:EmployeeID"`
=======
	SaleList       []SaleList       `gorm:"foreignKey:EmployeeID"`
	SalesContract  []SalesContract  `gorm:"foreignKey:EmployeeID"`
>>>>>>> upstream/main
}
