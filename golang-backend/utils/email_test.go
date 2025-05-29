package utils

import (
	"ashleshaJewells/models"
	"strings"
	"testing"
)

func TestCheckoutEmailTemplates(t *testing.T) {
	// Create a sample checkout object
	checkout := models.Checkout{
		FullName:   "John Doe",
		Email:      "johndoe@example.com",
		Phone:      "1234567890",
		ProductID:  101,
		Quantity:   2,
		TotalPrice: 49999.99,
		Address:    "123 Luxury Lane, Beverly Hills",
		OrderID:    "order_12345",
	}

	// Test customer email template
	customerEmailBody, err := LoadTemplate("templates/customer_email.html", checkout)
	if err != nil {
		t.Errorf("Failed to load customer email template: %v", err)
	}

	if len(customerEmailBody) == 0 {
		t.Errorf("Customer email body is empty, expected formatted content")
	}

	// Test sales email template
	salesEmailBody, err := LoadTemplate("templates/sales_email.html", checkout)
	if err != nil {
		t.Errorf("Failed to load sales email template: %v", err)
	}

	if len(salesEmailBody) == 0 {
		t.Errorf("Sales email body is empty, expected formatted content")
	}

	// Verify that dynamic fields are correctly replaced
	if !contains(customerEmailBody, "John Doe") {
		t.Errorf("Customer email body does not contain the customer's name")
	}

	if !contains(salesEmailBody, "order_12345") {
		t.Errorf("Sales email body does not contain the order ID")
	}

	if !contains(salesEmailBody, "123 Luxury Lane, Beverly Hills") {
		t.Errorf("Sales email body does not contain the customer's address")
	}
}

// Helper function to check if a string contains a substring
func contains(body, substring string) bool {
	return len(body) > 0 && len(substring) > 0 && stringContains(body, substring)
}

// Function to check for substring without case sensitivity
func stringContains(body, substring string) bool {
	return strings.Contains(strings.ToLower(body), strings.ToLower(substring))
}
