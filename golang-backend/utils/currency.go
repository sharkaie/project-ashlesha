package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
)

type LocationData struct {
	Country string `json:"country"`
}

func GetCountryFromIP(ip string) (string, error) {
	apiURL := fmt.Sprintf("https://ipinfo.io/%s?token=YOUR_IPINFO_API_KEY", ip)
	resp, err := http.Get(apiURL)
	if err != nil {
		return "", err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var location LocationData
	if err := json.Unmarshal(body, &location); err != nil {
		return "", err
	}

	return location.Country, nil
}

type ExchangeRates struct {
	Rates map[string]float64 `json:"rates"`
}

func GetExchangeRates(baseCurrency string) (map[string]float64, error) {
	apiURL := fmt.Sprintf("https://api.exchangerate-api.com/v4/latest/%s", baseCurrency)
	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var rates ExchangeRates
	if err := json.Unmarshal(body, &rates); err != nil {
		return nil, err
	}

	return rates.Rates, nil
}
