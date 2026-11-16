package api_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"umkm-marketplace/backend/internal/api"
)

func TestHealthHandler(t *testing.T) {
	router := api.NewRouter()

	req, err := http.NewRequest(http.MethodGet, "/api/health", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, rr.Code)
	}

	contentType := rr.Header().Get("Content-Type")
	if contentType != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", contentType)
	}

	var res map[string]string
	if err := json.Unmarshal(rr.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal body: %v", err)
	}

	if res["status"] != "ok" {
		t.Errorf("expected status ok, got %s", res["status"])
	}
}

func TestProductsHandler(t *testing.T) {
	router := api.NewRouter()

	req, err := http.NewRequest(http.MethodGet, "/api/products", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, rr.Code)
	}

	contentType := rr.Header().Get("Content-Type")
	if contentType != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", contentType)
	}

	var products []api.Product
	if err := json.Unmarshal(rr.Body.Bytes(), &products); err != nil {
		t.Fatalf("failed to unmarshal body: %v", err)
	}

	if len(products) == 0 {
		t.Errorf("expected at least 1 product, got %d", len(products))
	}
}

func TestCORSMiddleware(t *testing.T) {
	router := api.NewRouter()

	req, err := http.NewRequest(http.MethodOptions, "/api/health", nil)
	if err != nil {
		t.Fatalf("failed to create options request: %v", err)
	}

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK && rr.Code != http.StatusNoContent {
		t.Errorf("expected status 200 or 204 for OPTIONS, got %d", rr.Code)
	}

	origin := rr.Header().Get("Access-Control-Allow-Origin")
	if origin == "" {
		t.Errorf("expected Access-Control-Allow-Origin header")
	}
}
