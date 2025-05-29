package main

import (
	"ashleshaJewells/config"
	"ashleshaJewells/middlewares"
	"ashleshaJewells/routes"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Load configuration
	config.LoadConfig()

	// Connect to database
	config.ConnectDatabase()

	// Initialize Razorpay
	config.InitRazorpay()

	// Create Fiber app
	app := fiber.New()

	// Enable CORS with default settings
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",                           // Replace with your frontend URL
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS", // Allow specific HTTP methods
		AllowHeaders: "Content-Type, Authorization", // Allow specific headers
	}))

	// Apply global authentication middleware
	app.Use(middlewares.AuthMiddleware())

	// Set up routes
	routes.SetupRoutes(app)

	// Ensure uploads directory exists
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		if err := os.Mkdir("uploads", os.ModePerm); err != nil {
			log.Fatalf("Failed to create uploads directory: %v", err)
		}
	}

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-quit
		log.Println("Shutting down server...")
		if err := app.Shutdown(); err != nil {
			log.Fatalf("Server shutdown failed: %v", err)
		}
	}()

	// Start server
	log.Println("Server is running on http://localhost:8080")
	log.Fatal(app.Listen(":4000"))
}
