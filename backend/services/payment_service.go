package services

import (
	"time"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

type PaymentService struct {
	DB *gorm.DB
}

func NewPaymentService(db *gorm.DB) *PaymentService {
	return &PaymentService{DB: db}
}

func (s *PaymentService) FindAll(status, segment, cid, eid string) ([]entity.Payment, error) {
	var payments []entity.Payment
	q := s.DB.Preload("Receipt").Preload("PaymentMethod").
		Preload("Customer").Preload("Employee")

	if status != "" {
		q = q.Where("status = ?", status)
	}
	switch segment {
	case "ซื้อ":
		q = q.Where("sales_contract_id IS NOT NULL")
	case "เช่า":
		q = q.Where("rent_contract_id IS NOT NULL")
	}

	if cid != "" {
		q = q.Where("customer_id = ?", cid)
	}
	if eid != "" {
		q = q.Where("employee_id = ?", eid)
	}

	err := q.Order("id desc").Find(&payments).Error
	return payments, err
}

func (s *PaymentService) UploadProof(id uint) (*entity.Payment, error) {
	var p entity.Payment
	if err := s.DB.First(&p, id).Error; err != nil {
		return nil, err
	}
	p.Status = entity.StatusChecking
	if p.PaymentDate.IsZero() {
		p.PaymentDate = time.Now()
	}
	if err := s.DB.Save(&p).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (s *PaymentService) PatchStatus(id uint, status string) (*entity.Payment, error) {
	var p entity.Payment
	if err := s.DB.First(&p, id).Error; err != nil {
		return nil, err
	}
	p.Status = status
	if err := s.DB.Save(&p).Error; err != nil {
		return nil, err
	}
	return &p, nil
}
