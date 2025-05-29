package utils

import (
	"bytes"
	"html/template"
	"log"
)

// LoadTemplate loads an HTML template from a file and populates it with data
func LoadTemplate(templatePath string, data interface{}) (string, error) {
	// Parse the template file
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Printf("Error parsing template file %s: %v", templatePath, err)
		return "", err
	}

	// Apply the data to the template
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		log.Printf("Error executing template %s: %v", templatePath, err)
		return "", err
	}

	// Return the resulting string
	return buf.String(), nil
}
