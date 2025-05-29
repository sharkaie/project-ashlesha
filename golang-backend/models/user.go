package models

import "gorm.io/gorm"

// UserProfile model to represent user details
type UserProfile struct {
	gorm.Model
	FullName      string         `json:"fullName" gorm:"not null"`
	Email         string         `json:"email" gorm:"unique;not null"`
	Phone         string         `json:"phone"`
	Password      string         `json:"password" gorm:"not null"`
	Role          string         `json:"role" gorm:"not null"` // Roles: "Admin", "Sales", "Logistics"
	CompanyDetail CompanyDetails `json:"companyDetail" gorm:"foreignKey:UserID"`
}

// CompanyDetails model to represent company information
type CompanyDetails struct {
	gorm.Model
	UserID       uint   `json:"userId" gorm:"not null"`       // Foreign key to UserProfile
	CompanyName  string `json:"companyName" gorm:"not null"`  // Mandatory
	AddressLine1 string `json:"addressLine1" gorm:"not null"` // Mandatory
	AddressLine2 string `json:"addressLine2"`                 // Optional
	City         string `json:"city" gorm:"not null"`         // Mandatory
	State        string `json:"state" gorm:"not null"`        // Mandatory
	ZipCode      string `json:"zipCode" gorm:"not null"`      // Mandatory
	Country      string `json:"country" gorm:"not null"`      // Mandatory
	GSTIN        string `json:"gstin"`                        // Optional
	Phone        string `json:"phone"`                        // Optional
	Email        string `json:"email" gorm:"unique"`          // Optional
	LogoURL      string `json:"logoURL" gorm:"not null"`      // Mandatory for invoices
}
