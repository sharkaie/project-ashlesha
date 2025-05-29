package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"github.com/gofiber/fiber/v2"
	"time"
)

type AnalyticsResponse struct {
	TotalRevenue float64           `json:"totalRevenue"`
	OrderStats   OrderStats        `json:"orderStats"`
	TopProducts  []TopProduct      `json:"topProducts"`
	TopCustomers []CustomerInsight `json:"topCustomers"`
}

type OrderStats struct {
	Received  int64 `json:"received"`
	Completed int64 `json:"completed"`
	Cancelled int64 `json:"cancelled"`
}

type TopProduct struct {
	ProductID    uint    `json:"productId"`
	ProductName  string  `json:"productName"`
	TotalRevenue float64 `json:"totalRevenue"`
	QuantitySold uint    `json:"quantitySold"`
}

type CustomerInsight struct {
	CustomerName string  `json:"customerName"`
	Email        string  `json:"email"`
	TotalOrders  int64   `json:"totalOrders"`
	TotalSpent   float64 `json:"totalSpent"`
}

func GetAnalytics(c *fiber.Ctx) error {
	var response AnalyticsResponse

	// Parse time period
	timeFilter := c.Query("timePeriod", "all") // Options: "daily", "monthly", "yearly", "all"
	startDate := time.Time{}
	endDate := time.Now()

	switch timeFilter {
	case "daily":
		startDate = endDate.AddDate(0, 0, -1)
	case "monthly":
		startDate = endDate.AddDate(0, -1, 0)
	case "yearly":
		startDate = endDate.AddDate(-1, 0, 0)
	}

	// Total Revenue
	if err := config.DB.Model(&models.Checkout{}).
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Select("SUM(total_price)").
		Scan(&response.TotalRevenue).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to calculate total revenue"})
	}

	// Order Stats
	config.DB.Model(&models.Checkout{}).
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Count(&response.OrderStats.Received)

	config.DB.Model(&models.Checkout{}).
		Where("order_status = ? AND created_at BETWEEN ? AND ?", "Completed", startDate, endDate).
		Count(&response.OrderStats.Completed)

	config.DB.Model(&models.Checkout{}).
		Where("order_status = ? AND created_at BETWEEN ? AND ?", "Cancelled", startDate, endDate).
		Count(&response.OrderStats.Cancelled)

	// Top Products
	var topProducts []TopProduct
	config.DB.Table("checkout_products").
		Select("product_id, products.name AS product_name, SUM(checkout_products.total) AS total_revenue, SUM(checkout_products.quantity) AS quantity_sold").
		Joins("INNER JOIN products ON checkout_products.product_id = products.id").
		Where("checkout_products.created_at BETWEEN ? AND ?", startDate, endDate).
		Group("product_id, products.name").
		Order("total_revenue DESC").
		Limit(5).
		Scan(&topProducts)
	response.TopProducts = topProducts

	// Customer Insights
	var customerInsights []CustomerInsight
	config.DB.Table("checkouts").
		Select("full_name AS customer_name, email, COUNT(*) AS total_orders, SUM(total_price) AS total_spent").
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Group("full_name, email").
		Order("total_spent DESC").
		Limit(5).
		Scan(&customerInsights)
	response.TopCustomers = customerInsights

	return c.JSON(response)
}
