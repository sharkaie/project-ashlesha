package handlers

import (
	"ashleshaJewells/config"
	"ashleshaJewells/models"
	"github.com/gofiber/fiber/v2"
	"log"
)

// CreateUserWithCompany creates a user and their associated company details
func CreateUserWithCompany(c *fiber.Ctx) error {
	var user models.UserProfile
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate required fields
	if user.FullName == "" || user.Email == "" || user.Password == "" || user.CompanyDetail.CompanyName == "" || user.CompanyDetail.AddressLine1 == "" || user.CompanyDetail.City == "" || user.CompanyDetail.State == "" || user.CompanyDetail.ZipCode == "" || user.CompanyDetail.Country == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required fields"})
	}

	// Check for existing user with the same email
	var existingUser models.UserProfile
	if err := config.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "User with this email already exists"})
	}

	// Save user and associated company details
	if err := config.DB.Create(&user).Error; err != nil {
		log.Println("Error saving user and company details:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user and company details"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User and company created successfully", "user": user})
}

// AddUserToCompany adds a user to an existing company
func AddUserToCompany(c *fiber.Ctx) error {
	type AddUserInput struct {
		FullName  string `json:"fullName"`
		Email     string `json:"email"`
		Phone     string `json:"phone"`
		Password  string `json:"password"`
		CompanyID uint   `json:"companyId"`
	}

	var input AddUserInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate required fields
	if input.FullName == "" || input.Email == "" || input.Password == "" || input.CompanyID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required fields"})
	}

	// Check if the company exists
	var company models.CompanyDetails
	if err := config.DB.First(&company, input.CompanyID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Company not found"})
	}

	// Check for existing user with the same email
	var existingUser models.UserProfile
	if err := config.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "User with this email already exists"})
	}

	// Create the new user
	newUser := models.UserProfile{
		FullName: input.FullName,
		Email:    input.Email,
		Phone:    input.Phone,
		Password: input.Password,
	}

	// Save user and associate with the company
	if err := config.DB.Create(&newUser).Error; err != nil {
		log.Println("Error saving user to the company:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add user to the company"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User added to the company successfully", "user": newUser})
}

// GetUserWithCompany fetches a user and their associated company details
func GetUserWithCompany(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.UserProfile

	if err := config.DB.Preload("CompanyDetail").First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(user)
}

// GetUsersByCompany fetches all users associated with a specific company
func GetUsersByCompany(c *fiber.Ctx) error {
	companyID := c.Params("companyId")
	var company models.CompanyDetails

	// Check if the company exists
	if err := config.DB.First(&company, companyID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Company not found"})
	}

	// Fetch all users associated with the company
	var users []models.UserProfile
	if err := config.DB.Where("company_detail_id = ?", companyID).Find(&users).Error; err != nil {
		log.Println("Error fetching users for the company:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve users for the company"})
	}

	return c.JSON(users)
}
