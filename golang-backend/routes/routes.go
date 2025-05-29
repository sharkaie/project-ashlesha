package routes

import (
	"ashleshaJewells/handlers"
	"ashleshaJewells/middlewares"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// Public routes
	app.Post("/api/checkout", handlers.SubmitCheckout)                   // Used for customer checkout
	app.Get("/api/products", handlers.GetProducts)                       // Fetch all products
	app.Get("/api/products/:slug", handlers.GetProductBySlug)            // Fetch product details by slug
	app.Post("/api/cart", handlers.AddToCart)                            // Add items to cart
	app.Get("/api/cart/:sessionId", handlers.GetCartItems)               // Fetch cart items
	app.Delete("/api/cart/:sessionId", handlers.RemoveCart)              // Remove all items from cart by session
	app.Delete("/api/cart/:sessionId/item/:id", handlers.RemoveCartItem) // Remove a single item by ID
	app.Put("/api/cart/:sessionId/item/:id", handlers.UpdateCartQuantity)
	app.Get("/api/cart/:sessionId/count", handlers.GetCartCount)
	app.Post("/api/addUser", handlers.CreateUserWithCompany)

	app.Get("/api/process-payment/:token", handlers.PaymentSuccess) // Process payment

	// Dashboard routes
	app.Post("/api/products", middlewares.RoleMiddleware("Admin"), handlers.CreateProduct)         // Create a product
	app.Put("/api/products/:slug", middlewares.RoleMiddleware("Admin"), handlers.UpdateProduct)    // Update product
	app.Delete("/api/products/:slug", middlewares.RoleMiddleware("Admin"), handlers.DeleteProduct) // Delete product

	app.Get("/api/orders", middlewares.RoleMiddleware("Admin", "Sales"), handlers.GetAllOrders)                          // View all orders
	app.Get("/api/orders/:orderId", middlewares.RoleMiddleware("Admin", "Sales"), handlers.GetOrderDetails)              // Order details
	app.Put("/api/orders/:orderId/status", middlewares.RoleMiddleware("Admin", "Logistics"), handlers.UpdateOrderStatus) // Update order status
	app.Get("/api/orders/export", middlewares.RoleMiddleware("Admin"), handlers.ExportOrders)                            // Export orders

	app.Get("/api/invoices/:orderId", middlewares.RoleMiddleware("Admin", "Sales"), handlers.DownloadInvoice) // Download invoice

	app.Get("/api/analytics", middlewares.RoleMiddleware("Admin", "Sales"), handlers.GetAnalytics) // Analytics

	app.Post("/api/manufacturers", middlewares.RoleMiddleware("Admin"), handlers.AddManufacturer) // Add manufacturer
	app.Get("/api/manufacturers", middlewares.RoleMiddleware("Admin"), handlers.GetManufacturers) // View manufacturers

	app.Get("/api/logistics/orders", middlewares.RoleMiddleware("Admin", "Logistics"), handlers.GetOrdersForDelivery)                 // Orders for delivery
	app.Put("/api/logistics/orders/:orderId/status", middlewares.RoleMiddleware("Admin", "Logistics"), handlers.UpdateShippingStatus) // Update shipping status
	app.Get("/api/logistics/orders/:orderId/address", middlewares.RoleMiddleware("Admin", "Logistics"), handlers.GetShippingAddress)  // Shipping address

}
