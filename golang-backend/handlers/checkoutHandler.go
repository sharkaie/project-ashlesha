package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"ashleshaJewells/utils"
	"context"
	"crypto/rand"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/plutov/paypal/v4"
	"log"
)

// generateUniqueOrderID generates a 6-character alphanumeric OrderID and ensures uniqueness in the database.
func generateUniqueOrderID() (string, error) {
	for {
		// Generate a random 6-character alphanumeric string
		b := make([]byte, 6)
		_, err := rand.Read(b)
		if err != nil {
			return "", err
		}

		orderID := fmt.Sprintf("%X", b[:3]) // Convert to hex for simplicity (6 characters)

		// Check uniqueness in the database
		var existingCheckout models.Checkout
		if err := config.DB.Where("order_id = ?", orderID).First(&existingCheckout).Error; err != nil {
			if err.Error() == "record not found" {
				return orderID, nil // Unique ID generated
			}
		}
		// If not unique, retry
	}
}

func processCart(sessionID string, totalPrice, totalTax, totalShipping *float64) ([]models.CartItem, []models.CheckoutProduct, error) {
	var cartItems []models.CartItem
	if err := config.DB.Where("session_id = ?", sessionID).Find(&cartItems).Error; err != nil {
		log.Println("Error fetching cart items:", err)
		return nil, nil, fmt.Errorf("failed to fetch cart items")
	}

	var checkoutProducts []models.CheckoutProduct
	for _, cartItem := range cartItems {
		var product models.Product
		if err := config.DB.First(&product, cartItem.ProductID).Error; err != nil {
			log.Println("Error finding product:", err)
			return nil, nil, fmt.Errorf("invalid product ID: %d", cartItem.ProductID)
		}

		// Calculate totals
		itemSubtotal := product.Price * float64(cartItem.Quantity)
		itemTax := 0.0
		if !product.IsTaxInclusive {
			itemTax = itemSubtotal * (product.TaxRate / 100)
		}
		itemShipping := 0.0
		if product.ShippingRequired {
			itemShipping = product.ShippingCost * float64(cartItem.Quantity)
		}

		// Update totals
		*totalPrice += itemSubtotal
		*totalTax += itemTax
		*totalShipping = 0

		// Append to checkout products
		checkoutProducts = append(checkoutProducts, models.CheckoutProduct{
			ProductID: product.ID,
			Quantity:  cartItem.Quantity,
			Price:     product.Price,
			Total:     itemSubtotal + itemTax + itemShipping,
			RingSize:  cartItem.RingSize, // Add ring size here
		})
	}

	return cartItems, checkoutProducts, nil
}

func validateAddress(address models.Address, addressType string) error {
	if address.StreetAddress == "" || address.City == "" || address.State == "" || address.PostalCode == "" || address.Country == "" {
		return fmt.Errorf("%s address fields are missing", addressType)
	}
	return nil
}

func SubmitCheckout(c *fiber.Ctx) error {
	log.Println("SubmitCheckout Initiated")

	// Parse checkout data
	var checkout models.Checkout
	if err := c.BodyParser(&checkout); err != nil {
		log.Println("Error parsing checkout data:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid checkout data"})
	}

	// Validate required fields
	if checkout.FirstName == "" || checkout.LastName == "" || checkout.Email == "" || checkout.Phone == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Required fields are missing"})
	}

	if err := validateAddress(checkout.ShippingAddress, "Shipping"); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := validateAddress(checkout.BillingAddress, "Billing"); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Start a transaction
	tx := config.DB.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback() // Rollback transaction on panic
			log.Println("Transaction rolled back due to panic:", r)
		}
	}()

	// Fetch cart items and calculate totals
	var totalPrice, totalTax, totalShipping float64
	cartItems, checkoutProducts, err := processCart(checkout.SessionID, &totalPrice, &totalTax, &totalShipping)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Ensure the cart is not empty
	if len(cartItems) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cart is empty"})
	}

	// Generate unique OrderID
	orderID, err := generateUniqueOrderID()
	if err != nil {
		log.Println("Error generating unique OrderID:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate OrderID"})
	}
	checkout.OrderID = orderID
	checkout.TotalPrice = totalPrice + totalTax + totalShipping

	// Save checkout and products in the database
	if err := config.DB.Create(&checkout).Error; err != nil {
		log.Println("Error saving checkout to database:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save checkout data"})
	}
	for _, product := range checkoutProducts {
		product.CheckoutID = checkout.ID
		if err := config.DB.Create(&product).Error; err != nil {
			log.Println("Error saving checkout product to database:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save checkout products"})
		}
	}

	// Initialize PayPal client
	// payPalClient, err := paypal.NewClient("AUoCv7all4nmo_PCbRnPybtDGyd85H7cQL2A0yjak575f52e8G_nt5MB3Uq6rMj4wWzFsc-w7DQJdyEy", "EKWhyLMq13_gaJeU3gLBcxcm8fzQBJhFBoSxBsEUvjT269BhXfrZRjopnvGn-hDrnO2bjDo1oDR3RgNS", paypal.APIBaseLive)

	// SandBox
	payPalClient, err := paypal.NewClient("ASIkuKM2nxPTGLMSs9gLBwhRiqJmI49dC8GZbn57KJ6Bnc4RENTt0NQahnK5UMruIr6olJ36lRDsRLMF", "ENxHIS0I_K0RvXNns4NypA-66lKvbd7xsMFW_rxSpY9c8Bher8ROwGxEKL2HOo68DStVr6ObmPCLTkVi", paypal.APIBaseSandBox)

	if err != nil {
		log.Println("Error initializing PayPal client:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to initialize payment gateway"})
	}

	// Fetch PayPal access token
	ctx := context.Background()
	_, err = payPalClient.GetAccessToken(ctx)
	if err != nil {
		log.Println("Error retrieving PayPal access token:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to authenticate payment gateway"})
	}

	// Create PayPal order
	purchaseUnits := []paypal.PurchaseUnitRequest{
		{
			Amount: &paypal.PurchaseUnitAmount{
				Currency: "USD",
				Value:    fmt.Sprintf("%.2f", checkout.TotalPrice),
			},
			Description: "Ashlesha Jewells Order: " + checkout.OrderID,
		},
	}

	paymentSource := &paypal.PaymentSource{
		Paypal: &paypal.PaymentSourcePaypal{
			ExperienceContext: paypal.PaymentSourcePaypalExperienceContext{
				BrandName:               "Ashlesha Jewells",
				ShippingPreference:      "GET_FROM_FILE",
				LandingPage:             "GUEST_CHECKOUT",
				PaymentMethodPreference: "IMMEDIATE_PAYMENT_REQUIRED",
				UserAction:              "PAY_NOW",
				Locale:                  "en",
				ReturnURL:               "https://ashleshajewells.com/process-payment",
				CancelURL:               "https://ashleshajewells.com/payment-cancel",
			},
		},
	}

	order, err := payPalClient.CreateOrder(ctx, paypal.OrderIntentCapture, purchaseUnits, paymentSource, nil)
	if err != nil {
		log.Println("Error creating PayPal order:", err)
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to initiate payment"})
	}

	// Get approval link
	var approvalLink string
	for _, link := range order.Links {
		if link.Rel == "payer-action" {
			approvalLink = link.Href
			break
		}
	}
	if approvalLink == "" {
		log.Println("Approval link not found in PayPal order response")
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve payment link"})
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		log.Println("Error committing transaction:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to commit transaction"})
	}

	// Fetch company details
	var companyDetails models.CompanyDetails
	if err := config.DB.First(&companyDetails).Error; err != nil {
		log.Println("Error fetching company details:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch company details"})
	}

	// Prepare invoice data
	invoiceData := utils.InvoiceData{
		LogoURL:        companyDetails.LogoURL,
		CompanyName:    companyDetails.CompanyName,
		CompanyAddress: fmt.Sprintf("%s, %s, %s, %s - %s", companyDetails.AddressLine1, companyDetails.AddressLine2, companyDetails.City, companyDetails.State, companyDetails.ZipCode),
		GSTIN:          companyDetails.GSTIN,
		CustomerName:   checkout.FirstName + " " + checkout.LastName,
		OrderID:        checkout.OrderID,
		OrderDate:      checkout.CreatedAt.Format("02 Jan 2006"),
		Products:       []utils.ProductData{},
		TotalPrice:     checkout.TotalPrice,
	}

	// Add products to the invoice
	for _, product := range checkoutProducts {
		var prod models.Product
		if err := config.DB.First(&prod, product.ProductID).Error; err == nil {
			invoiceData.Products = append(invoiceData.Products, utils.ProductData{
				Name:     prod.Name,
				Quantity: product.Quantity,
				Price:    product.Price,
				Total:    product.Total,
			})
		}
	}

	// Generate invoice PDF
	invoicePath := fmt.Sprintf("./invoices/order_%s.pdf", checkout.OrderID)
	if err := utils.GenerateInvoice(invoiceData, invoicePath); err != nil {
		log.Println("Error generating invoice:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate invoice"})
	}

	//rollback the transaction if any error occurs
	//defer func() {
	//	if r := recover(); r != nil {
	//		tx.Rollback()
	//		log.Println("Transaction rolled back due to panic:", r)
	//	}

	// Return the payment link to the frontend
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":     "Payment link created successfully",
		"paymentLink": approvalLink,
	})
}

//func PaymentSuccess(c *fiber.Ctx) error {
//
//	// Get the token from the path
//	token := c.Params("token")
//	if token == "" {
//		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Token not found"})
//	}
//
//	// Initialize PayPal client (Sandbox mode)
//	payPalClient, err := paypal.NewClient("ASIkuKM2nxPTGLMSs9gLBwhRiqJmI49dC8GZbn57KJ6Bnc4RENTt0NQahnK5UMruIr6olJ36lRDsRLMF", "ENxHIS0I_K0RvXNns4NypA-66lKvbd7xsMFW_rxSpY9c8Bher8ROwGxEKL2HOo68DStVr6ObmPCLTkVi", paypal.APIBaseSandBox)
//	if err != nil {
//		log.Println("Error initializing PayPal client:", err)
//		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to initialize payment gateway"})
//	}
//
//	// Fetch PayPal access token
//	ctx := context.Background()
//	_, err = payPalClient.GetAccessToken(ctx)
//	if err != nil {
//		log.Println("Error retrieving PayPal access token:", err)
//		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to authenticate payment gateway"})
//	}
//
//	//var checkout models.Checkout
//	// Prepare CaptureOrderRequest
//	captureRequest := paypal.CaptureOrderRequest{}
//
//	// Capture the payment
//	_, err = payPalClient.CaptureOrder(ctx, token, captureRequest)
//	if err != nil {
//		log.Println("Error capturing PayPal order:", err)
//		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to capture payment"})
//	}
//
//	//// Update the checkout status
//	//if err := config.DB.Where("order_id = ?", token).First(&checkout).Error; err != nil {
//	//	log.Println("Error fetching checkout data:", err)
//	//	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch checkout data"})
//	//}
//	//
//	//checkout.OrderStatus = "Paid"
//	//if err := config.DB.Save(&checkout).Error; err != nil {
//	//	log.Println("Error updating checkout status:", err)
//	//	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update checkout status"})
//	//}
//
//	// Send order confirmation email (optional)
//	// if err := utils.SendOrderConfirmation(checkout); err != nil {
//	// 	log.Println("Error sending order confirmation email:", err)
//	// }
//
//	return c.Status(fiber.StatusOK).JSON(fiber.Map{
//		"message":       "Payment successful",
//		"paymentStatus": captureResponse.Status, // This is the status from PayPal
//		"captureID":     captureResponse.ID,     // Capture ID from PayPal
//	})
//
//}

func PaymentSuccess(c *fiber.Ctx) error {

	// Get the token from the path
	token := c.Params("token")
	if token == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Token not found"})
	}

	// Initialize PayPal client (Sandbox mode)
	payPalClient, err := paypal.NewClient("ASIkuKM2nxPTGLMSs9gLBwhRiqJmI49dC8GZbn57KJ6Bnc4RENTt0NQahnK5UMruIr6olJ36lRDsRLMF", "ENxHIS0I_K0RvXNns4NypA-66lKvbd7xsMFW_rxSpY9c8Bher8ROwGxEKL2HOo68DStVr6ObmPCLTkVi", paypal.APIBaseSandBox)
	if err != nil {
		log.Println("Error initializing PayPal client:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to initialize payment gateway"})
	}

	// Fetch PayPal access token
	ctx := context.Background()
	_, err = payPalClient.GetAccessToken(ctx)
	if err != nil {
		log.Println("Error retrieving PayPal access token:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to authenticate payment gateway"})
	}

	//var checkout models.Checkout
	//// Fetch checkout data
	//if err := config.DB.Where("order_id = ?", token).First(&checkout).Error; err != nil {
	//	log.Println("Error fetching checkout data:", err)
	//	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch checkout data"})
	//}
	//
	//// Get order id, total price, product name, and quantity
	//var phone, email, fullname, orderID, totalPrice, productName, quantity string
	//var checkoutProducts []models.CheckoutProduct
	//if err := config.DB.Where("checkout_id = ?", checkout.ID).Find(&checkoutProducts).Error; err != nil {
	//	log.Println("Error fetching checkout products:", err)
	//	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch checkout products"})
	//}
	//
	//for _, product := range checkoutProducts {
	//	var prod models.Product
	//	if err := config.DB.First(&prod, product.ProductID).Error; err == nil {
	//		productName = prod.Name
	//		quantity = strconv.Itoa(int(product.Quantity))
	//	}
	//}
	//
	//orderID = checkout.OrderID
	//totalPrice = fmt.Sprintf("%.2f", checkout.TotalPrice)
	//phone = checkout.Phone
	//email = checkout.Email
	//fullname = checkout.FirstName + " " + checkout.LastName

	// Prepare CaptureOrderRequest
	captureRequest := paypal.CaptureOrderRequest{}

	// Capture the payment
	captureResponse, err := payPalClient.CaptureOrder(ctx, token, captureRequest)
	if err != nil {
		log.Println("Error capturing PayPal order:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to capture payment"})
	}

	// Check the capture response status and send it back to the client
	if captureResponse.Status != "COMPLETED" {
		log.Println("Payment capture failed. Status:", captureResponse.Status)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Payment capture failed"})
	}

	// Update the checkout status
	//checkout.OrderStatus = "Paid"
	//if err := config.DB.Save(&checkout).Error; err != nil {
	//	log.Println("Error updating checkout status:", err)
	//	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update checkout status"})
	//}
	//
	//// Prepare data to inject into the template
	//customerData := struct {
	//	FullName   string
	//	OrderID    string
	//	Phone 	string
	//	Email 	string
	//	TotalPrice string
	//	ProductName string
	//	Quantity   string
	//}{
	//	FullName:   fullname,
	//	OrderID:    orderID,
	//	Phone:		phone,
	//	Email:		email,
	//	TotalPrice: totalPrice,
	//	ProductName: productName,
	//	Quantity:   quantity,
	//}
	//
	//// Send order confirmation email to the customer
	//if err := utils.SendOrderConfirmationEmail(email, customerData); err != nil {
	//	log.Println("Error sending order confirmation email:", err)
	//	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to send order confirmation email"})
	//}
	//
	//// Send order confirmation email to the sales team
	//if err := utils.SendOrderConfirmationEmail("sales@ashlesahjewells.com", customerData); err != nil {
	//	log.Println("Error sending sales email:", err)
	//	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to send sales email"})
	//}

	// Return the capture response status and other details to the client
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Payment successful",
		//"orderID":       orderID,
		//"totalPrice":    totalPrice,
		//"productName":   productName,
		//"quantity":      quantity,
		"paymentStatus": captureResponse.Status, // This is the status from PayPal
		"captureID":     captureResponse.ID,     // Capture ID from PayPal
	})
}
