package api_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"umkm-marketplace/backend/internal/api"
	"umkm-marketplace/backend/internal/auth"
	"umkm-marketplace/backend/internal/database"

	"github.com/jackc/pgx/v5/pgxpool"
)

func getTestDB(t *testing.T) *pgxpool.Pool {
	t.Helper()
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:password123@localhost:5433/umkm_marketplace?sslmode=disable"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	pool, err := database.Connect(ctx, dbURL)
	if err != nil {
		t.Skipf("Skipping integration test; PostgreSQL not accessible: %v", err)
		return nil
	}

	if err := database.RunMigrations(context.Background(), pool); err != nil {
		t.Fatalf("failed to run migrations: %v", err)
	}

	return pool
}

func TestRegisterAdminForbidden(t *testing.T) {
	router := api.NewRouter(nil)

	payload := map[string]string{
		"name":     "Super Admin",
		"email":    "admin_attempt@umkm.local",
		"password": "Password123!",
		"role":     "admin",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected status %d for admin register, got %d", http.StatusBadRequest, rr.Code)
	}

	var res map[string]string
	_ = json.Unmarshal(rr.Body.Bytes(), &res)
	if res["error"] == "" {
		t.Errorf("expected error message in response")
	}
}

func TestRegisterAndLoginBuyer(t *testing.T) {
	pool := getTestDB(t)
	defer pool.Close()

	router := api.NewRouter(pool)

	uniqueEmail := fmt.Sprintf("buyer_%d@umkm.local", time.Now().UnixNano())
	registerPayload := map[string]string{
		"name":     "Budi Pembeli",
		"email":    uniqueEmail,
		"password": "BuyerPassword123!",
		"role":     "buyer",
	}
	body, _ := json.Marshal(registerPayload)

	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Fatalf("expected status %d for buyer register, got %d: %s", http.StatusCreated, rr.Code, rr.Body.String())
	}

	var regRes api.AuthResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &regRes); err != nil {
		t.Fatalf("failed to unmarshal register response: %v", err)
	}

	if regRes.User.Role != "buyer" {
		t.Errorf("expected user role buyer, got %s", regRes.User.Role)
	}

	if regRes.Token == "" {
		t.Errorf("expected non-empty token")
	}

	// Test Login
	loginPayload := map[string]string{
		"email":    uniqueEmail,
		"password": "BuyerPassword123!",
	}
	lBody, _ := json.Marshal(loginPayload)
	lReq := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBuffer(lBody))
	lReq.Header.Set("Content-Type", "application/json")
	lRr := httptest.NewRecorder()
	router.ServeHTTP(lRr, lReq)

	if lRr.Code != http.StatusOK {
		t.Fatalf("expected status %d for buyer login, got %d: %s", http.StatusOK, lRr.Code, lRr.Body.String())
	}

	var loginRes api.AuthResponse
	_ = json.Unmarshal(lRr.Body.Bytes(), &loginRes)
	if loginRes.Token == "" {
		t.Errorf("expected token on login")
	}

	claims, err := auth.ValidateToken(loginRes.Token)
	if err != nil {
		t.Fatalf("token validation failed: %v", err)
	}
	if claims.Role != "buyer" {
		t.Errorf("expected claims role buyer, got %s", claims.Role)
	}
}

func TestRegisterAndLoginSellerWithStore(t *testing.T) {
	pool := getTestDB(t)
	defer pool.Close()

	router := api.NewRouter(pool)

	uniqueEmail := fmt.Sprintf("seller_%d@umkm.local", time.Now().UnixNano())
	registerPayload := map[string]string{
		"name":        "Siti Penjual",
		"email":       uniqueEmail,
		"password":    "SellerPassword123!",
		"role":        "seller",
		"store_name":  "Toko Keripik Siti",
		"description": "Menjual keripik khas daerah",
		"address":     "Yogyakarta",
	}
	body, _ := json.Marshal(registerPayload)

	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Fatalf("expected status %d for seller register, got %d: %s", http.StatusCreated, rr.Code, rr.Body.String())
	}

	var regRes api.AuthResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &regRes); err != nil {
		t.Fatalf("failed to unmarshal register response: %v", err)
	}

	if regRes.User.Role != "seller" {
		t.Errorf("expected user role seller, got %s", regRes.User.Role)
	}

	if regRes.Store == nil || regRes.Store.Name != "Toko Keripik Siti" {
		t.Errorf("expected store name 'Toko Keripik Siti', got %+v", regRes.Store)
	}
}

func TestLoginInvalidCredentials(t *testing.T) {
	pool := getTestDB(t)
	defer pool.Close()

	router := api.NewRouter(pool)

	payload := map[string]string{
		"email":    "nonexistent@umkm.local",
		"password": "WrongPassword!",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusUnauthorized {
		t.Errorf("expected status %d, got %d", http.StatusUnauthorized, rr.Code)
	}
}

func TestRegisterDuplicateEmailReturnsConflict(t *testing.T) {
	pool := getTestDB(t)
	defer pool.Close()

	router := api.NewRouter(pool)

	email := fmt.Sprintf("dup_%d@umkm.local", time.Now().UnixNano())
	payload := map[string]string{
		"name":     "Pengguna Duplikat",
		"email":    email,
		"password": "Password123!",
		"role":     "buyer",
	}
	body, _ := json.Marshal(payload)

	// First registration
	req1 := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewBuffer(body))
	req1.Header.Set("Content-Type", "application/json")
	rr1 := httptest.NewRecorder()
	router.ServeHTTP(rr1, req1)
	if rr1.Code != http.StatusCreated {
		t.Fatalf("first registration failed: %d", rr1.Code)
	}

	// Duplicate registration attempt
	body2, _ := json.Marshal(payload)
	req2 := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewBuffer(body2))
	req2.Header.Set("Content-Type", "application/json")
	rr2 := httptest.NewRecorder()
	router.ServeHTTP(rr2, req2)

	if rr2.Code != http.StatusConflict {
		t.Errorf("expected status 409 Conflict for duplicate email, got %d", rr2.Code)
	}

	// Also test wrong password for registered user
	wrongLogin := map[string]string{
		"email":    email,
		"password": "WrongPasswordEntered!",
	}
	wBody, _ := json.Marshal(wrongLogin)
	wReq := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBuffer(wBody))
	wReq.Header.Set("Content-Type", "application/json")
	wRr := httptest.NewRecorder()
	router.ServeHTTP(wRr, wReq)

	if wRr.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 Unauthorized for wrong password on registered user, got %d", wRr.Code)
	}
}

func TestAdminLoginSuccess(t *testing.T) {
	pool := getTestDB(t)
	defer pool.Close()

	if err := database.SeedDefaultAdmin(context.Background(), pool); err != nil {
		t.Fatalf("failed to seed admin: %v", err)
	}

	router := api.NewRouter(pool)

	payload := map[string]string{
		"email":    "admin@umkm.local",
		"password": "AdminPassword123!",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200 for admin login, got %d: %s", rr.Code, rr.Body.String())
	}

	var res api.AuthResponse
	_ = json.Unmarshal(rr.Body.Bytes(), &res)

	if res.User.Role != "admin" {
		t.Errorf("expected user role admin, got %s", res.User.Role)
	}

	claims, err := auth.ValidateToken(res.Token)
	if err != nil {
		t.Fatalf("failed to validate token: %v", err)
	}
	if claims.Role != "admin" {
		t.Errorf("expected token role admin, got %s", claims.Role)
	}
}

