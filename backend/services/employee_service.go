package services

import (
	"errors"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"gorm.io/gorm"
)

type EmployeeService struct {
	db *gorm.DB
}

func NewEmployeeService(db *gorm.DB) *EmployeeService {
	return &EmployeeService{db: db}
}

// List all
func (s *EmployeeService) List() ([]entity.Employee, error) {
	var items []entity.Employee
	if err := s.db.Order("employee_id asc").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

// Create
func (s *EmployeeService) Create(e *entity.Employee) error {
	return s.db.Create(e).Error
}

// Get by ID
func (s *EmployeeService) Get(id uint) (*entity.Employee, error) {
	var e entity.Employee
	if err := s.db.First(&e, "employee_id = ?", id).Error; err != nil {
		return nil, err
	}
	return &e, nil
}

// ✅ NEW: Get by email (for login)
func (s *EmployeeService) GetByEmail(email string) (*entity.Employee, error) {
	var e entity.Employee
	if err := s.db.Where("email = ?", email).First(&e).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid email or password")
		}
		return nil, err
	}
	return &e, nil
}

// Update with whitelist & key mapping
func (s *EmployeeService) Update(id uint, patch map[string]any) (*entity.Employee, error) {
	var e entity.Employee
	if err := s.db.First(&e, "employee_id = ?", id).Error; err != nil {
		return nil, err
	}

	// remove forbidden keys
	delete(patch, "employeeID")
	delete(patch, "leaves")
	delete(patch, "createdAt")
	delete(patch, "updatedAt")
	delete(patch, "deletedAt")
	delete(patch, "password")

	// whitelist mapping
	keyMap := map[string]string{
		"firstName":    "first_name",
		"lastName":     "last_name",
		"profileImage": "profile_image",
		"email":        "email",
		"phone":        "phone",
		"address":      "address",
		"birthday":     "birthday", // must be time.Time already
		"sex":          "sex",
		"position":     "position",
		"jobType":      "job_type",
		"totalSales":   "total_sales",
	}

	fixedPatch := map[string]any{}
	for k, v := range patch {
		if col, ok := keyMap[k]; ok {
			if str, okStr := v.(string); okStr && str == "" {
				continue // skip unintended blank overwrite
			}
			fixedPatch[col] = v
		}
		// ignore non-whitelisted keys
	}

	if len(fixedPatch) == 0 {
		return &e, nil // nothing to update
	}

	if err := s.db.Model(&e).Updates(fixedPatch).Error; err != nil {
		return nil, err
	}
	if err := s.db.First(&e, "employee_id = ?", id).Error; err != nil {
		return nil, err
	}
	return &e, nil
}

// Delete (hard delete)
func (s *EmployeeService) Delete(id uint) error {
	tx := s.db.Unscoped().Delete(&entity.Employee{}, "employee_id = ?", id)
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return errors.New("employee not found")
	}
	return nil
}
