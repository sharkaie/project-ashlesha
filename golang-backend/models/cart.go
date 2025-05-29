package models

import "gorm.io/gorm"

type CartItem struct {
	gorm.Model
	ProductID uint   `json:"productID" gorm:"not null"` // Product ID
	SessionID string `json:"sessionID" gorm:"not null"` // Session ID for cart tracking
	Quantity  uint   `json:"quantity" gorm:"not null"`  // Quantity of the product in the cart
	RingSize  string `json:"ringSize"`                  // Ring size (optional, applicable for rings)
}
