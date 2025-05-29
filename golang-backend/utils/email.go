package utils

import (
	"ashleshaJewells/config"
	"bytes"
	"fmt"
	"html/template"

	"gopkg.in/gomail.v2"
)

// Helper function to send email
func sendEmail(to, subject, body string) error {
	smtpHost := config.AppConfig.Email.SMTPHost
	smtpPort := config.AppConfig.Email.SMTPPort
	smtpUsername := config.AppConfig.Email.SenderEmail
	smtpPassword := config.AppConfig.Email.SenderPassword

	msg := gomail.NewMessage()
	msg.SetHeader("From", smtpUsername)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", body)

	dialer := gomail.NewDialer(smtpHost, smtpPort, smtpUsername, smtpPassword)
	if err := dialer.DialAndSend(msg); err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}

	return nil
}

// Load and render the HTML template with dynamic data
func renderTemplate(templatePath string, data interface{}) (string, error) {
	// Open the template file
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		return "", fmt.Errorf("failed to parse template: %v", err)
	}

	// Create a temporary buffer to hold the rendered content
	var renderedContent bytes.Buffer
	err = tmpl.Execute(&renderedContent, data)
	if err != nil {
		return "", fmt.Errorf("failed to render template: %v", err)
	}

	return renderedContent.String(), nil
}

// SendOrderConfirmationEmail sends an email to the customer with the order details
func SendOrderConfirmationEmail(to string, data interface{}) error {
	// Load the HTML template
	customerTemplatePath := "/templates/customer_email.html"
	body, err := renderTemplate(customerTemplatePath, data)
	if err != nil {
		return fmt.Errorf("failed to render template: %v", err)
	}

	salesTemplatePath := "/templates/sales_email.html"
	salesBody, err := renderTemplate(salesTemplatePath, data)
	if err != nil {
		return fmt.Errorf("failed to render template: %v", err)
	}

	// Send the email
	subject := "Order Confirmation"
	if err := sendEmail(to, subject, body); err != nil {
		return fmt.Errorf("failed to send order confirmation email: %v", err)
	}

	// Send the email to the sales team
	subject = "New Order Received"
	if err := sendEmail(to, subject, salesBody); err != nil {
		return fmt.Errorf("failed to send sales email: %v", err)
	}

	return nil
}
