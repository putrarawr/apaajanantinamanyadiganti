package database

import (
	"context"
	"embed"
	"fmt"
	"log"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed migrations/*.sql
var migrationFS embed.FS

// RunMigrations applies embedded SQL migrations to PostgreSQL.
func RunMigrations(ctx context.Context, pool *pgxpool.Pool) error {
	createTableQuery := `
	CREATE TABLE IF NOT EXISTS schema_migrations (
		version VARCHAR(255) PRIMARY KEY,
		applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := pool.Exec(ctx, createTableQuery); err != nil {
		return fmt.Errorf("failed to create schema_migrations table: %w", err)
	}

	entries, err := migrationFS.ReadDir("migrations")
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".sql") {
			continue
		}

		version := entry.Name()

		var exists bool
		checkQuery := `SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1);`
		if err := pool.QueryRow(ctx, checkQuery, version).Scan(&exists); err != nil {
			return fmt.Errorf("failed to check migration status for %s: %w", version, err)
		}

		if exists {
			continue
		}

		log.Printf("[MIGRATION] Applying database migration: %s\n", version)
		content, err := migrationFS.ReadFile("migrations/" + version)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", version, err)
		}

		tx, err := pool.Begin(ctx)
		if err != nil {
			return fmt.Errorf("failed to begin transaction for %s: %w", version, err)
		}

		if _, err := tx.Exec(ctx, string(content)); err != nil {
			_ = tx.Rollback(ctx)
			return fmt.Errorf("failed to execute migration %s: %w", version, err)
		}

		recordQuery := `INSERT INTO schema_migrations (version) VALUES ($1);`
		if _, err := tx.Exec(ctx, recordQuery, version); err != nil {
			_ = tx.Rollback(ctx)
			return fmt.Errorf("failed to record migration %s: %w", version, err)
		}

		if err := tx.Commit(ctx); err != nil {
			return fmt.Errorf("failed to commit migration %s: %w", version, err)
		}

		log.Printf("[MIGRATION] Successfully applied migration: %s\n", version)
	}

	return nil
}
