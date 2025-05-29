package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"github.com/gofiber/fiber/v2"
	"log"
)

// GetOrdersForDelivery fetches all orders ready for shipping or delivery
func GetOrdersForDelivery(c *fiber.Ctx) error {
	var orders []models.Checkout

	// Fetch orders with status "Processing"
	if err := config.DB.Preload("Products").
		Where("order_status = ?", "Processing").
		Find(&orders).Error; err != nil {
		log.Println("Error fetching orders for delivery:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch orders for delivery"})
	}

	return c.JSON(orders)
}

// UpdateShippingStatus updates the shipping status of an order
func UpdateShippingStatus(c *fiber.Ctx) error {
	orderId := c.Params("orderId")
	var order models.Checkout

	// Find the order
	if err := config.DB.Preload("Products").Where("order_id = ?", orderId).First(&order).Error; err != nil {
		log.Println("Order not found:", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	// Parse new status
	type StatusUpdate struct {
		OrderStatus string `json:"orderStatus"` // Expecting "Shipped" or "Delivered"
	}
	var update StatusUpdate
	if err := c.BodyParser(&update); err != nil {
		log.Println("Invalid request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Validate status
	if update.OrderStatus != "Shipped" && update.OrderStatus != "Delivered" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order status"})
	}

	// Update the order status
	order.OrderStatus = update.OrderStatus
	if err := config.DB.Save(&order).Error; err != nil {
		log.Println("Error updating order status:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update order status"})
	}

	// Notify the customer if the order is "Shipped" or "Delivered"
	go func() {
		err := NotifyShippingStatusUpdate(order, update.OrderStatus)
		if err != nil {
			log.Println("Error sending shipping status update:", err)
		}
	}()

	return c.JSON(fiber.Map{"message": "Order status updated successfully"})
}

// GetShippingAddress retrieves detailed shipping information for a specific order
func GetShippingAddress(c *fiber.Ctx) error {
	orderId := c.Params("orderId")
	var order models.Checkout

	// Find the order
	if err := config.DB.Where("order_id = ?", orderId).First(&order).Error; err != nil {
		log.Println("Error fetching shipping address:", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	// Return the shipping address
	return c.JSON(fiber.Map{
		"orderId":         order.OrderID,
		"customerName":    order.FirstName + " " + order.LastName,
		"shippingAddress": order.ShippingAddress,
	})
}
