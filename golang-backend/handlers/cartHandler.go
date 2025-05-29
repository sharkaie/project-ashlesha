package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"github.com/gofiber/fiber/v2"
	"log"
)

// AddToCart handles adding a product to the cart or updating its quantity
func AddToCart(c *fiber.Ctx) error {
	var cartItem models.CartItem
	if err := c.BodyParser(&cartItem); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	log.Println(cartItem.ProductID)

	// Validate required fields
	if cartItem.ProductID == 0 || cartItem.SessionID == "" || cartItem.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ProductID, SessionID, and Quantity are required"})
	}

	// Fetch the product from the database
	var product models.Product
	if err := config.DB.First(&product, cartItem.ProductID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Check if the product already exists in the cart for the same ring size
	var existingCartItem models.CartItem
	if err := config.DB.Where("product_id = ? AND session_id = ? AND ring_size = ?", cartItem.ProductID, cartItem.SessionID, cartItem.RingSize).First(&existingCartItem).Error; err == nil {
		// Update quantity if the product and ring size are already in the cart
		existingCartItem.Quantity += cartItem.Quantity

		// Save the updated cart item
		if err := config.DB.Save(&existingCartItem).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update cart item"})
		}

		// Calculate the total price for this cart item dynamically
		totalPrice := float64(existingCartItem.Quantity) * product.Price

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message":    "Cart updated successfully",
			"cartItem":   existingCartItem,
			"totalPrice": totalPrice,
		})
	}

	// Add a new cart item
	if err := config.DB.Create(&cartItem).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add to cart"})
	}

	// Calculate the total price for the new cart item
	totalPrice := float64(cartItem.Quantity) * product.Price

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":    "Item added to cart successfully",
		"cartItem":   cartItem,
		"totalPrice": totalPrice,
	})
}

func GetCartItems(c *fiber.Ctx) error {
	sessionID := c.Params("sessionId")

	var cartItems []models.CartItem
	if err := config.DB.Where("session_id = ?", sessionID).Find(&cartItems).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch cart items"})
	}

	var cartDetails []fiber.Map
	var subtotal, totalTax, totalShipping, grandTotal float64

	for _, item := range cartItems {
		var product models.Product
		if err := config.DB.Preload("Images").First(&product, item.ProductID).Error; err != nil {
			continue
		}

		// Fetch the first available image for the product
		var productImage string
		if len(product.Images) > 0 {
			productImage = product.Images[0].Src
		}

		// Calculate item-level totals
		itemSubtotal := product.Price * float64(item.Quantity)
		tax := 0.0
		if !product.IsTaxInclusive {
			tax = itemSubtotal * (product.TaxRate / 100)
		}
		shipping := 0.0
		if product.ShippingRequired {
			shipping = product.ShippingCost * float64(item.Quantity)
		}

		total := itemSubtotal + tax + shipping
		subtotal += itemSubtotal
		totalTax += tax
		totalShipping += shipping
		grandTotal += total

		// Add product details to the response
		cartDetails = append(cartDetails, fiber.Map{
			"productId":   product.ID,
			"productSlug": product.Slug, // Include product slug
			"name":        product.Name,
			"description": product.Description, // Optional product description
			"quantity":    item.Quantity,
			"ringSize":    item.RingSize, // Ring size from the cart item
			"image":       productImage,  // First image of the product
			"price":       product.Price, // Product price
			"subtotal":    itemSubtotal,  // Subtotal for the item
			"tax":         tax,           // Tax for the item
			"shipping":    shipping,      // Shipping cost for the item
			"total":       total,         // Total for the item
		})
	}

	// Return the full cart details
	return c.JSON(fiber.Map{
		"items":      cartDetails,
		"subtotal":   subtotal,
		"tax":        totalTax,
		"shipping":   totalShipping,
		"grandTotal": grandTotal,
	})
}

func GetCartCount(c *fiber.Ctx) error {
	sessionID := c.Params("sessionId")

	// Count the total number of products in the cart
	var cartCount int64
	if err := config.DB.Model(&models.CartItem{}).Where("session_id = ?", sessionID).Count(&cartCount).Error; err != nil {
		log.Println("Error counting cart items:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to count cart items"})
	}

	// Return the count
	return c.JSON(fiber.Map{
		"cartCount": cartCount,
	})
}

// RemoveCart removes all items from the cart for a specific session
func RemoveCart(c *fiber.Ctx) error {
	sessionID := c.Params("sessionId")
	if err := config.DB.Where("session_id = ?", sessionID).Delete(&models.CartItem{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to clear cart"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Cart cleared successfully"})
}

// RemoveCartItem removes a single item from the cart for a specific session
func RemoveCartItem(c *fiber.Ctx) error {
	id := c.Params("id")               // Cart item ID
	sessionID := c.Params("sessionId") // Session ID

	// Check if the item exists and belongs to the session
	var cartItem models.CartItem
	if err := config.DB.Where("product_id = ? AND session_id = ?", id, sessionID).First(&cartItem).Error; err != nil {
		if err.Error() == "record not found" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Cart item not found for this session"})
		}
		log.Println("Error fetching cart item:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to find cart item"})
	}

	// Delete the item
	if err := config.DB.Delete(&cartItem).Error; err != nil {
		log.Println("Error deleting cart item:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to remove cart item"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Cart item removed successfully"})
}

// UpdateCartQuantity updates the quantity of a specific cart item with increment or decrement functionality
func UpdateCartQuantity(c *fiber.Ctx) error {
	id := c.Params("id")               // Cart item ID
	sessionID := c.Params("sessionId") // Session ID

	// Parse request body for increment/decrement action
	var payload struct {
		Qty int `json:"qty"`
	}
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate action
	if payload.Qty < 1 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Quantity, must be more less than equal to 1'"})
	}
	if payload.Qty > 10 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Quantity, must be less than equal to 10'"})
	}

	// Fetch the cart item
	var cartItem models.CartItem
	if err := config.DB.Where("product_id = ? AND session_id = ?", id, sessionID).First(&cartItem).Error; err != nil {
		if err.Error() == "record not found" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Cart item not found for this session"})
		}
		log.Println("Error fetching cart item:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to find cart item"})
	}

	// Fetch the product to validate stock limits
	var product models.Product
	if err := config.DB.First(&product, cartItem.ProductID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Update the quantity
	cartItem.Quantity = uint(payload.Qty)

	// Save the updated cart item
	if err := config.DB.Save(&cartItem).Error; err != nil {
		log.Println("Error updating cart item:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update cart item"})
	}

	// Return the updated cart item
	return c.JSON(fiber.Map{
		"message":  "Cart item updated successfully",
		"Quantity": cartItem.Quantity,
	})
}
