package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"umkm-marketplace/backend/internal/auth"

	"github.com/jackc/pgx/v5/pgxpool"
)

// SeedDefaultAdmin creates an initial admin account if none exists.
func SeedDefaultAdmin(ctx context.Context, pool *pgxpool.Pool) error {
	adminEmail := os.Getenv("ADMIN_EMAIL")
	if adminEmail == "" {
		adminEmail = "admin@umkm.local"
	}

	adminPassword := os.Getenv("ADMIN_PASSWORD")
	if adminPassword == "" {
		adminPassword = "AdminPassword123!"
	}

	var exists bool
	checkQuery := `SELECT EXISTS(SELECT 1 FROM users WHERE role = 'admin');`
	if err := pool.QueryRow(ctx, checkQuery).Scan(&exists); err != nil {
		return fmt.Errorf("failed to check existing admin: %w", err)
	}

	if exists {
		return nil
	}

	passwordHash, err := auth.HashPassword(adminPassword)
	if err != nil {
		return fmt.Errorf("failed to hash admin password: %w", err)
	}

	insertQuery := `
		INSERT INTO users (name, email, password_hash, role)
		VALUES ($1, $2, $3, 'admin');
	`
	if _, err := pool.Exec(ctx, insertQuery, "Platform Administrator", adminEmail, passwordHash); err != nil {
		return fmt.Errorf("failed to seed admin user: %w", err)
	}

	log.Printf("[SEEDER] Default admin account seeded: %s (password: %s)\n", adminEmail, adminPassword)
	return nil
}
