package api

import (
	"encoding/json"
	"net/http"
)

// Product represents a mock item for the UMKM marketplace.
type Product struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Seller   string  `json:"seller"`
	Category string  `json:"category"`
}

// HealthHandler returns API health status.
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "Backend UMKM Marketplace API is running",
	})
}

// ProductsHandler returns sample products for testing frontend integration.
func ProductsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	products := []Product{
		{
			ID:       "1",
			Name:     "Kopi Arabika Gayo UMKM",
			Price:    35000,
			Seller:   "Koperasi Tani Makmur",
			Category: "Minuman",
		},
		{
			ID:       "2",
			Name:     "Keripik Tempe Renyah",
			Price:    15000,
			Seller:   "UMKM Berkah Jaya",
			Category: "Makanan Ringan",
		},
		{
			ID:       "3",
			Name:     "Batik Tulis Motif Parang",
			Price:    175000,
			Seller:   "Batik Asli Solo",
			Category: "Fashion",
		},
	}

	_ = json.NewEncoder(w).Encode(products)
}
