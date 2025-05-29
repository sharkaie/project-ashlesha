package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

// AddManufacturer adds a new manufacturer to the database
func AddManufacturer(c *fiber.Ctx) error {
	var manufacturer models.Manufacturer
	if err := c.BodyParser(&manufacturer); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate required fields
	if manufacturer.Name == "" || manufacturer.Email == "" || manufacturer.Phone == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required fields"})
	}

	// Save manufacturer to the database
	if err := config.DB.Create(&manufacturer).Error; err != nil {
		log.Println("Error saving manufacturer:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add manufacturer"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Manufacturer added successfully", "manufacturer": manufacturer})
}

// GetManufacturers lists all manufacturers
func GetManufacturers(c *fiber.Ctx) error {
	var manufacturers []models.Manufacturer
	if err := config.DB.Find(&manufacturers).Error; err != nil {
		log.Println("Error fetching manufacturers:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve manufacturers"})
	}

	return c.JSON(manufacturers)
}
