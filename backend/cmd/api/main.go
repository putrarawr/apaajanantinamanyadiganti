package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"umkm-marketplace/backend/internal/api"
	"umkm-marketplace/backend/internal/database"
)

func main() {
	// 1. Load .env file if available (checks current dir, backend/, or parent)
	_ = godotenv.Load(".env", "backend/.env", "../.env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://postgres:password123@localhost:5433/umkm_marketplace?sslmode=disable"
	}

	// 2. Connect to PostgreSQL
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var pool *pgxpool.Pool
	var err error

	pool, err = database.Connect(ctx, databaseURL)
	if err != nil {
		log.Printf("[WARNING] Could not connect to PostgreSQL: %v\n", err)
		log.Printf("[HINT] Pastikan PostgreSQL menyala di %s. Jika dijalankan di laptop teman/anggota tim, ubah 'localhost' di backend/.env menjadi IP laptop host Docker.\n", databaseURL)
		log.Println("[INFO] Server will continue without active database connection.")
	} else {
		defer pool.Close()

		// Run pending database migrations
		if err := database.RunMigrations(context.Background(), pool); err != nil {
			log.Fatalf("Database migration failed: %v\n", err)
		}

		// Seed initial admin if none exists
		if err := database.SeedDefaultAdmin(context.Background(), pool); err != nil {
			log.Printf("[WARNING] Admin seeder failed: %v\n", err)
		}
	}

	// 3. Start HTTP Server
	router := api.NewRouter(pool)

	addr := ":" + port
	log.Printf("UMKM Marketplace Backend API listening on http://localhost%s\n", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
