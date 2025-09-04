package entity

import (
	"time"

	"gorm.io/gorm"
)

type Receipt struct {
	gorm.Model

	ReceiptNumber string    `json:"receiptnumber" gorm:"uniqueIndex"`
	IssueDate     time.Time `json:"issuedate"`
	Link          string    `json:"link"`
	Status        string    `json:"status"`

	PaymentID uint     `json:"PaymentID"`
	Payment   *Payment `gorm:"foreignKey:PaymentID" json:"Payment"`
}
