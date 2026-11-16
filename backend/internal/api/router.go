package api

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewRouter registers the routes and returns the HTTP handler with CORS support.
func NewRouter(db *pgxpool.Pool) http.Handler {
	server := &Server{DB: db}
	mux := http.NewServeMux()

	// Health and Mock Catalog
	mux.HandleFunc("/api/health", server.HealthHandler)
	mux.HandleFunc("/api/products", server.ProductsHandler)

	// Auth Endpoints (Login, Register)
	mux.HandleFunc("/api/auth/register", server.RegisterHandler)
	mux.HandleFunc("/api/auth/login", server.LoginHandler)

	return CORSMiddleware(mux)
}
