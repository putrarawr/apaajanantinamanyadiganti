package api

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Server holds application state and dependencies such as database connection.
type Server struct {
	DB *pgxpool.Pool
}

// Product represents an item in the UMKM marketplace.
type Product struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Seller   string  `json:"seller"`
	Category string  `json:"category"`
}

// HealthHandler returns API health and PostgreSQL connection status.
func (s *Server) HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	dbStatus := "disconnected"
	if s.DB != nil {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()
		if err := s.DB.Ping(ctx); err == nil {
			dbStatus = "connected"
		}
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":    "ok",
		"message":   "Backend UMKM Marketplace API is running",
		"db_status": dbStatus,
	})
}

// ProductsHandler returns sample products for testing frontend integration.
func (s *Server) ProductsHandler(w http.ResponseWriter, r *http.Request) {
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
