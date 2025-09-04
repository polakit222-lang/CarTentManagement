package entity

import "gorm.io/gorm"

type Condition struct {
	gorm.Model
	ConditionName string

	// 1 Condition can have many Cars
	Cars []Car `gorm:"foreignKey:ConditionID"`
}
