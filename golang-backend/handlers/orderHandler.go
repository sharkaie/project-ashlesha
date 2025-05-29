package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"encoding/csv"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

// GetAllOrders fetches all orders with optional filters
func GetAllOrders(c *fiber.Ctx) error {
	var orders []models.Checkout

	// Apply filters
	orderStatus := c.Query("status", "") // Default: fetch all orders
	query := config.DB.Preload("Products")

	if orderStatus != "" {
		query = query.Where("order_status = ?", orderStatus)
	}

	if err := query.Find(&orders).Error; err != nil {
		log.Println("Error fetching orders:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve orders"})
	}

	return c.JSON(orders)
}

// GetOrderDetails fetches detailed information about a specific order
func GetOrderDetails(c *fiber.Ctx) error {
	orderId := c.Params("orderId")
	var order models.Checkout

	if err := config.DB.Preload("Products").Where("order_id = ?", orderId).First(&order).Error; err != nil {
		log.Println("Error fetching order details:", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	return c.JSON(order)
}

// UpdateOrderStatus updates the status of an order
func UpdateOrderStatus(c *fiber.Ctx) error {
	orderId := c.Params("orderId")
	var order models.Checkout

	// Fetch the order
	if err := config.DB.Preload("Products").Where("order_id = ?", orderId).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	// Parse the new status
	type StatusUpdate struct {
		OrderStatus string `json:"orderStatus"`
	}
	var update StatusUpdate
	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Update the order status
	order.OrderStatus = update.OrderStatus
	if err := config.DB.Save(&order).Error; err != nil {
		log.Println("Error updating order status:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update order status"})
	}

	// Send shipping notifications for Shipped or Delivered status
	if update.OrderStatus == "Shipped" || update.OrderStatus == "Delivered" {
		go func() {
			err := NotifyShippingStatusUpdate(order, update.OrderStatus)
			if err != nil {
				log.Println("Error sending shipping status update:", err)
			}
		}()
	}

	return c.JSON(fiber.Map{"message": "Order status updated successfully"})
}

// ExportOrders exports all orders as a CSV file
func ExportOrders(c *fiber.Ctx) error {
	var orders []models.Checkout

	if err := config.DB.Preload("Products").Find(&orders).Error; err != nil {
		log.Println("Error fetching orders:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve orders"})
	}

	// Create CSV file
	filePath := "./exports/orders.csv"
	file, err := os.Create(filePath)
	if err != nil {
		log.Println("Error creating CSV file:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create export file"})
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write headers
	err = writer.Write([]string{"Order ID", "Customer Name", "Order Status", "Total Price", "Created At"})
	if err != nil {
		return err
	}

	// Write order data
	for _, order := range orders {
		err := writer.Write([]string{
			order.OrderID,
			order.FirstName + " " + order.LastName,
			order.OrderStatus,
			fmt.Sprintf("%.2f", order.TotalPrice),
			order.CreatedAt.String(),
		})
		if err != nil {
			return err
		}
	}

	return c.JSON(fiber.Map{
		"message":  "Orders exported successfully",
		"filePath": filePath,
	})
}
