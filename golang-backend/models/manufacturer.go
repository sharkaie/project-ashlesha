package models

import "gorm.io/gorm"

type Manufacturer struct {
	gorm.Model
	Name  string `json:"name" gorm:"not null"`
	Email string `json:"email" gorm:"unique;not null"`
	Phone string `json:"phone"`
}
