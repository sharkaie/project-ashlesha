package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"ashleshaJewells/utils"
	"bytes"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"html/template"
	"log"
)

func getProductsFromCart(sessionID string) ([]fiber.Map, error) {
	var cartItems []models.CartItem
	if err := config.DB.Where("session_id = ?", sessionID).Find(&cartItems).Error; err != nil {
		log.Println("Error fetching cart items:", err)
		return nil, fmt.Errorf("failed to fetch cart items")
	}

	var products []fiber.Map
	for _, cartItem := range cartItems {
		var product models.Product
		if err := config.DB.First(&product, cartItem.ProductID).Error; err != nil {
			log.Println("Error fetching product details:", err)
			continue
		}

		products = append(products, fiber.Map{
			"productId": product.ID,
			"name":      product.Name,
			"quantity":  cartItem.Quantity,
			"price":     product.Price,
			"subtotal":  product.Price * float64(cartItem.Quantity),
		})
	}

	return products, nil
}

func NotifyOrderReceived(order models.Checkout, invoicePath string) error {
	// Fetch product details from the cart
	products, err := getProductsFromCart(order.SessionID)
	if err != nil {
		log.Println("Error fetching products from cart:", err)
		return err
	}

	// Build product details for the email
	productDetails := ""
	for _, product := range products {
		productDetails += fmt.Sprintf("<li>%s (Quantity: %d)</li>", product["name"], product["quantity"])
	}

	// Prepare email data
	emailData := struct {
		FullName       string
		OrderID        string
		TotalPrice     float64
		ProductDetails string
	}{
		FullName:       order.FirstName + " " + order.LastName,
		OrderID:        order.OrderID,
		TotalPrice:     order.TotalPrice,
		ProductDetails: productDetails,
	}

	// Parse the email template
	tmpl, err := template.ParseFiles("./templates/customer_email.html")
	if err != nil {
		log.Println("Error parsing customer email template:", err)
		return err
	}

	var emailBuffer bytes.Buffer
	if err := tmpl.Execute(&emailBuffer, emailData); err != nil {
		log.Println("Error executing customer email template:", err)
		return err
	}

	// Send the email to the customer
	err = utils.SendEmail(
		order.Email,
		"Order Confirmation - Ashlesha Jewells",
		emailBuffer.String(),
		true,
		[]string{invoicePath},
	)
	if err != nil {
		log.Println("Error sending order confirmation email to customer:", err)
		return err
	}

	return nil
}

func NotifyShippingStatusUpdate(order models.Checkout, status string) error {
	// Fetch product details from the cart
	products, err := getProductsFromCart(order.SessionID)
	if err != nil {
		log.Println("Error fetching products from cart:", err)
		return err
	}

	// Build product details for the email
	productDetails := ""
	for _, product := range products {
		productDetails += fmt.Sprintf("<li>%s (Quantity: %d)</li>", product["name"], product["quantity"])
	}

	// Prepare email content
	subject := fmt.Sprintf("Your Order %s - Ashlesha Jewells", status)
	body := fmt.Sprintf(`
		<h1>Your Order is %s!</h1>
		<p>Order ID: %s</p>
		<p>Total Amount: ₹%.2f</p>
		<h2>Products:</h2>
		<ul>%s</ul>
	`, status, order.OrderID, order.TotalPrice, productDetails)

	// Send the email to the customer
	err = utils.SendEmail(
		order.Email,
		subject,
		body,
		false,
		nil,
	)
	if err != nil {
		log.Println("Error sending shipping notification email:", err)
		return err
	}

	return nil
}

func SendOrderConfirmationEmail(order models.Checkout, invoicePath string) error {
	// Parse the email template
	tmpl, err := template.ParseFiles("./templates/customer_email.html")
	if err != nil {
		log.Println("Error parsing email template:", err)
		return err
	}

	// Fetch product details from the cart (using session ID)
	products, err := getProductsFromCart(order.SessionID)
	if err != nil {
		log.Println("Error fetching products from cart:", err)
		return err
	}

	// Build product details for the email
	productDetails := ""
	for _, product := range products {
		productDetails += fmt.Sprintf("%s (Quantity: %d)<br>", product["name"], product["quantity"])
	}

	// Prepare email data
	emailData := struct {
		FullName    string
		OrderID     string
		TotalPrice  float64
		ProductName string
		Quantity    uint
	}{
		FullName:    order.FirstName + " " + order.LastName,
		OrderID:     order.OrderID,
		TotalPrice:  order.TotalPrice,
		ProductName: productDetails, // List of product names and quantities
		Quantity:    0,              // Quantity is ignored for multiple products
	}

	// Execute the template with the data
	var emailBuffer bytes.Buffer
	if err := tmpl.Execute(&emailBuffer, emailData); err != nil {
		log.Println("Error executing email template:", err)
		return err
	}

	// Send the email with the invoice attached
	err = utils.SendEmail(
		order.Email,                             // Customer's email address
		"Order Confirmation - Ashlesha Jewells", // Subject
		emailBuffer.String(),                    // HTML body
		true,                                    // Is HTML
		[]string{invoicePath},                   // Attach the invoice PDF
	)
	if err != nil {
		log.Println("Error sending order confirmation email with invoice:", err)
		return err
	}

	log.Printf("Order confirmation email sent to %s for Order ID: %s with invoice attached\n", order.Email, order.OrderID)
	return nil
}
