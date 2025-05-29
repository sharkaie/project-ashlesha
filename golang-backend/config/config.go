package config

import (
	"log"
	"os"

	"ashleshaJewells/models"
	"github.com/razorpay/razorpay-go"
	"gopkg.in/yaml.v3"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB
var AppConfig Config
var RazorpayClient *razorpay.Client

// Config struct to hold YAML configuration
type Config struct {
	Database struct {
		URL string `yaml:"url"`
	} `yaml:"database"`
	Email struct {
		SMTPHost       string `yaml:"smtp_host"`
		SMTPPort       int    `yaml:"smtp_port"`
		SenderEmail    string `yaml:"sender_email"`
		SenderPassword string `yaml:"sender_password"`
	} `yaml:"email"`
	Payment struct {
		KeyID         string `yaml:"key_id"`
		KeySecret     string `yaml:"key_secret"`
		WebhookSecret string `yaml:"webhook_secret"`
	} `yaml:"payment"`
}

// LoadConfig reads configuration from config.yaml
func LoadConfig() {
	file, err := os.Open("config/config.yaml")
	if err != nil {
		log.Fatalf("Failed to open config file: %v", err)
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			log.Fatalf("Failed to close config file: %v", err)
		}
	}(file)

	decoder := yaml.NewDecoder(file)
	if err := decoder.Decode(&AppConfig); err != nil {
		log.Fatalf("Failed to parse config file: %v", err)
	}

	log.Println("Configuration loaded successfully.")
}

// ConnectDatabase initializes the database connection
func ConnectDatabase() {
	dsn := AppConfig.Database.URL
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Enable debug mode for development (optional)
	DB = DB.Debug()

	// Run database migrations
	if err := DB.AutoMigrate(
		&models.Checkout{},
		&models.Product{},
		&models.ProductImage{},
		&models.CartItem{},
		&models.CheckoutProduct{},
		&models.UserProfile{},
		&models.CompanyDetails{},
	); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database connected and migrations completed successfully.")
}

func CloseDatabase() {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Printf("Error getting database connection: %v", err)
		return
	}

	if err := sqlDB.Close(); err != nil {
		log.Printf("Error closing database connection: %v", err)
	} else {
		log.Println("Database connection closed.")
	}
}

// InitRazorpay initializes the Razorpay client
func InitRazorpay() {
	RazorpayClient = razorpay.NewClient(AppConfig.Payment.KeyID, AppConfig.Payment.KeySecret)
	log.Println("Razorpay initialized successfully")
}
