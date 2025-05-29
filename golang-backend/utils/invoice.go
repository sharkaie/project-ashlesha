package utils

import (
	"bytes"
	"html/template"
	"log"
	"os"
)

type InvoiceData struct {
	LogoURL        string
	CompanyName    string
	CompanyAddress string
	GSTIN          string
	CustomerName   string
	OrderID        string
	OrderDate      string
	Products       []ProductData
	TotalPrice     float64
}

type ProductData struct {
	Name     string
	Quantity uint
	Price    float64
	Total    float64
}

func GenerateInvoice(data InvoiceData, outputPath string) error {
	// Parse the HTML template
	tmpl, err := template.ParseFiles("./templates/invoice.html")
	if err != nil {
		log.Println("Error parsing invoice template:", err)
		return err
	}

	// Generate the HTML content
	var htmlBuffer bytes.Buffer
	if err := tmpl.Execute(&htmlBuffer, data); err != nil {
		log.Println("Error executing template:", err)
		return err
	}

	// Convert HTML to PDF (using any preferred library like Chromedp or wkhtmltopdf)
	err = ConvertHTMLToPDF(htmlBuffer.String(), outputPath)
	if err != nil {
		log.Println("Error converting HTML to PDF:", err)
		return err
	}

	return nil
}

func ConvertHTMLToPDF(htmlContent, outputPath string) error {
	// Placeholder: Implement conversion logic using wkhtmltopdf, chromedp, or similar
	file, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			log.Println("Failed to close file:", err)
		}
	}(file)

	_, err = file.WriteString(htmlContent)
	return err
}
