package api

import "net/http"

// NewRouter registers the routes and returns the HTTP handler with CORS support.
func NewRouter() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", HealthHandler)
	mux.HandleFunc("/api/products", ProductsHandler)
	return CORSMiddleware(mux)
}
