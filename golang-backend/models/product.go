package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name             string         `json:"name" gorm:"not null"`                  // Product name
	Slug             string         `json:"slug" gorm:"unique;not null"`           // URL-friendly slug
	Price            float64        `json:"price" gorm:"not null"`                 // Base price
	SKU              string         `json:"sku" gorm:"unique;not null"`            // Unique stock-keeping unit
	Stock            uint           `json:"stock" gorm:"default:0"`                // Stock availability
	Description      string         `json:"description" gorm:"type:text"`          // Description
	IsLimitedEdition bool           `json:"isLimitedEdition" gorm:"default:false"` // Limited edition flag
	Material         string         `json:"material" gorm:"not null"`              // Material (gold, silver, etc.)
	Weight           string         `json:"weight" gorm:"not null"`                // Weight
	Dimensions       string         `json:"dimensions"`                            // Dimensions (optional)
	CategoryID       uint           `json:"categoryID"`                            // Category foreign key
	Tags             string         `json:"tags" gorm:"type:text"`                 // Tags for filtering (JSON string)
	IsTaxInclusive   bool           `json:"isTaxInclusive" gorm:"default:true"`    // Price includes taxes
	TaxRate          float64        `json:"taxRate" gorm:"default:0"`              // Tax rate for tax-exclusive prices
	ShippingRequired bool           `json:"shippingRequired" gorm:"default:true"`  // Requires shipping
	ShippingCost     float64        `json:"shippingCost" gorm:"default:0.0"`       // New field for shipping cost
	CustomFeatures   JSONB          `json:"customFeatures" gorm:"type:jsonb"`      // Custom features (JSON)
	Images           []ProductImage `json:"images" gorm:"foreignKey:ProductID"`    // Product images
}

type ProductImage struct {
	gorm.Model
	ProductID uint   `json:"productID" gorm:"not null"`
	Name      string `json:"name"`
	Src       string `json:"src" gorm:"not null"`
	Alt       string `json:"alt"`
}

type JSONB map[string]interface{}

// Scan implements the sql.Scanner interface for JSONB
func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = JSONB{}
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to scan JSONB: type assertion to []byte failed")
	}

	return json.Unmarshal(bytes, j)
}

// Value implements the driver.Valuer interface for JSONB
func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}
