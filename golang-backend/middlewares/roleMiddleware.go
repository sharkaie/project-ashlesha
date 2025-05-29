package middlewares

import (
	"github.com/gofiber/fiber/v2"
)

// RoleMiddleware checks if the user has the required role
func RoleMiddleware(requiredRoles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Extract userRole from context
		userRole, ok := c.Locals("userRole").(string)
		if !ok {
			// userRole is missing or invalid
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized. Missing or invalid role.",
			})
		}

		// Check if the userRole matches one of the requiredRoles
		for _, role := range requiredRoles {
			if userRole == role {
				return c.Next()
			}
		}

		// Role doesn't match
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Forbidden. You do not have the required permissions.",
		})
	}
}

func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Example: Extract userRole from a JWT or session
		userRole := "Admin" // Replace with actual logic to extract user role
		c.Locals("userRole", userRole)

		return c.Next()
	}
}
