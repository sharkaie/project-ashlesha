package models

import "gorm.io/gorm"

type Checkout struct {
	gorm.Model
	SessionID       string  `json:"sessionId" gorm:"not null"`                                // Session ID
	FirstName       string  `json:"firstName" gorm:"not null"`                                // Customer's first name
	LastName        string  `json:"lastName" gorm:"not null"`                                 // Customer's last name
	Email           string  `json:"email"`                                                    // Customer's email
	Phone           string  `json:"phone"`                                                    // Customer's phone
	TotalPrice      float64 `json:"totalPrice" gorm:"not null"`                               // Grand total
	ShippingAddress Address `json:"shippingAddress" gorm:"embedded;embeddedPrefix:shipping_"` // Shipping address
	BillingAddress  Address `json:"billingAddress" gorm:"embedded;embeddedPrefix:billing_"`   // Billing address
	OrderID         string  `json:"orderId" gorm:"unique;"`                                   // Unique order ID
	OrderStatus     string  `json:"orderStatus" gorm:"default:'Pending'"`                     // Order lifecycle (Pending, Processing, etc.)
	Notes           string  `json:"notes"`                                                    // Optional customer notes
}

type Address struct {
	StreetAddress string `json:"streetAddress" gorm:"not null"` // Street address
	City          string `json:"city" gorm:"not null"`          // City
	State         string `json:"state" gorm:"not null"`         // State/Province
	PostalCode    string `json:"postalCode" gorm:"not null"`    // Postal code
	Country       string `json:"country" gorm:"not null"`       // Country
}

type CheckoutProduct struct {
	gorm.Model
	CheckoutID uint    `json:"checkoutId" gorm:"not null"` // Foreign key linking to the Checkout
	ProductID  uint    `json:"productId" gorm:"not null"`  // Foreign key linking to the Product
	Quantity   uint    `json:"quantity" gorm:"not null"`   // Quantity of the product in the checkout
	Price      float64 `json:"price" gorm:"not null"`      // Price per unit at checkout
	Total      float64 `json:"total" gorm:"not null"`      // Total price for this product (Price * Quantity)
	RingSize   string  `json:"ringSize"`                   // Ring size (optional, applicable for rings)
}
