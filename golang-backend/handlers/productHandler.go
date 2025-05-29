package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"log"
	"os"
	"strconv"
)

func CreateProduct(c *fiber.Ctx) error {
	var product models.Product
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate required fields
	if err := validateProductFields(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Save product to the database
	if err := config.DB.Create(&product).Error; err != nil {
		log.Printf("Error creating product (Name: %s, SKU: %s): %v", product.Name, product.SKU, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create product"})
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

func validateProductFields(product *models.Product) error {
	if product.Name == "" {
		return fmt.Errorf("Name is required")
	}
	if product.Slug == "" {
		return fmt.Errorf("Slug is required")
	}
	if product.Price <= 0 {
		return fmt.Errorf("Price must be greater than zero")
	}
	if product.SKU == "" {
		return fmt.Errorf("SKU is required")
	}
	if product.Material == "" {
		return fmt.Errorf("Material is required")
	}
	if product.Weight == "" {
		return fmt.Errorf("Weight is required")
	}
	if product.ShippingRequired && product.ShippingCost < 0 {
		return fmt.Errorf("Shipping cost must be zero or greater")
	}
	return nil
}

// GetProducts retrieves all products with their images
func GetProducts(c *fiber.Ctx) error {
	// Get pagination parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	offset := (page - 1) * limit

	// Fetch products with pagination
	var products []models.Product
	if err := config.DB.Preload("Images").Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		log.Println("Error fetching products:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve products"})
	}

	return c.JSON(fiber.Map{
		"page":     page,
		"limit":    limit,
		"products": products,
	})
}

func GetProductBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var product models.Product
	if err := config.DB.Preload("Images").Where("slug = ?", slug).First(&product).Error; err != nil {
		log.Printf("Product not found (Slug: %s): %v", slug, err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	return c.JSON(product)
}

func UpdateProduct(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var product models.Product

	// Find the product by slug
	if err := config.DB.Where("slug = ?", slug).First(&product).Error; err != nil {
		log.Printf("Product not found (Slug: %s): %v", slug, err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	var updatedFields map[string]interface{}
	if err := c.BodyParser(&updatedFields); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Iterate over the payload and update only the fields provided
	for key, value := range updatedFields {
		switch key {
		case "name":
			product.Name = value.(string)
		case "price":
			product.Price = value.(float64)
		case "stock":
			product.Stock = uint(value.(float64)) // Convert float64 to uint
		case "description":
			product.Description = value.(string)
		case "isLimitedEdition":
			product.IsLimitedEdition = value.(bool)
		case "material":
			product.Material = value.(string)
		case "weight":
			product.Weight = value.(string)
		case "dimensions":
			product.Dimensions = value.(string)
		case "tags":
			product.Tags = value.(string)
		case "customFeatures":
			if features, ok := value.(map[string]interface{}); ok {
				product.CustomFeatures = features
			}
		case "isTaxInclusive":
			product.IsTaxInclusive = value.(bool)
		case "taxRate":
			product.TaxRate = value.(float64)
		case "shippingRequired":
			product.ShippingRequired = value.(bool)
		case "images":
			if images, ok := value.([]map[string]interface{}); ok {
				for _, img := range images {
					// Check if an ID is provided in the image payload
					if id, exists := img["id"]; exists {
						// Find the existing image by ID
						var existingImage models.ProductImage
						if err := config.DB.First(&existingImage, id).Error; err == nil {
							// Update the existing image
							if name, ok := img["name"].(string); ok {
								existingImage.Name = name
							}
							if src, ok := img["src"].(string); ok {
								existingImage.Src = src
							}
							if alt, ok := img["alt"].(string); ok {
								existingImage.Alt = alt
							}
							// Save the updated image
							if err := config.DB.Save(&existingImage).Error; err != nil {
								log.Printf("Error updating image (ID: %v): %v", id, err)
							}
						} else {
							log.Printf("Image with ID %v not found: %v", id, err)
						}
					} else {
						// Add new image if no ID is provided
						newImage := models.ProductImage{
							ProductID: product.ID,
							Name:      img["name"].(string),
							Src:       img["src"].(string),
							Alt:       img["alt"].(string),
						}
						if err := config.DB.Create(&newImage).Error; err != nil {
							log.Printf("Error creating new image: %v", err)
						}
					}
				}
			}
		}
	}

	// Save the updated product
	if err := config.DB.Save(&product).Error; err != nil {
		log.Printf("Error updating product (Slug: %s): %v", slug, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product"})
	}

	// Retrieve the updated product with images
	if err := config.DB.Preload("Images").First(&product, product.ID).Error; err != nil {
		log.Printf("Error fetching updated product: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch updated product"})
	}

	return c.JSON(product)
}

// DeleteProduct handles deleting a product by slug
func DeleteProduct(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if err := config.DB.Where("slug = ?", slug).Delete(&models.Product{}).Error; err != nil {
		log.Printf("Error deleting product (Slug: %s): %v", slug, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete product"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// DownloadInvoice serves an invoice file for a given order ID
func DownloadInvoice(c *fiber.Ctx) error {
	orderId := c.Params("orderId")
	filePath := fmt.Sprintf("./invoices/order_%s.pdf", orderId)

	// Check if the invoice file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		log.Println("Invoice file not found:", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Invoice not found"})
	}

	// Serve the invoice file for download
	return c.SendFile(filePath)
}
