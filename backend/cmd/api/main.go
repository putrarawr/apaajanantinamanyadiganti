package main

import (
	"log"
	"net/http"
	"os"

	"umkm-marketplace/backend/internal/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := api.NewRouter()

	addr := ":" + port
	log.Printf("UMKM Marketplace Backend API listening on http://localhost%s\n", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
