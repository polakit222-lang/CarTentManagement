package services

import (
	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

type ReceiptService struct {
	DB *gorm.DB
}

func NewReceiptService(db *gorm.DB) *ReceiptService {
	return &ReceiptService{DB: db}
}

// ดึงใบเสร็จทั้งหมดของการชำระเงิน
func (s *ReceiptService) FindByPayment(paymentID uint) ([]entity.Receipt, error) {
	var receipts []entity.Receipt
	err := s.DB.
		Preload("Payment.Customer"). // ✅ preload customer
		Preload("Payment.Employee"). // (optional) preload employee ด้วย
		Find(&receipts, "payment_id = ?", paymentID).Error
	return receipts, err
}
