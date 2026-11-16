package api

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
	"time"

	"umkm-marketplace/backend/internal/auth"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// UserResponse represents sanitized user information for client responses.
type UserResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

// StoreResponse represents merchant store details.
type StoreResponse struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Address     string `json:"address"`
	IsVerified  bool   `json:"is_verified"`
}

// AuthResponse represents the payload returned after successful registration or login.
type AuthResponse struct {
	User  UserResponse   `json:"user"`
	Store *StoreResponse `json:"store,omitempty"`
	Token string         `json:"token"`
}

// RegisterRequest contains payload for user registration.
type RegisterRequest struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	Role        string `json:"role"`
	StoreName   string `json:"store_name,omitempty"`
	Description string `json:"description,omitempty"`
	Address     string `json:"address,omitempty"`
}

// LoginRequest contains credentials for user authentication.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// RegisterHandler handles user registration for buyer and seller roles.
func (s *Server) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Metode tidak diizinkan"})
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Format request tidak valid"})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.Role = strings.ToLower(strings.TrimSpace(req.Role))

	if req.Name == "" || req.Email == "" || req.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Nama, email, dan password wajib diisi"})
		return
	}

	// Strictly disallow public registration for admin role
	if req.Role == "admin" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Role admin tidak diizinkan melalui registrasi publik"})
		return
	}

	if req.Role != "buyer" && req.Role != "seller" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Role harus berupa 'buyer' atau 'seller'"})
		return
	}

	if s.DB == nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Koneksi database tidak tersedia"})
		return
	}

	hashedPassword, err := auth.HashPassword(req.Password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Gagal mengenkripsi password"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	tx, err := s.DB.Begin(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Gagal memulai transaksi"})
		return
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var user UserResponse
	insertUserQuery := `
		INSERT INTO users (name, email, password_hash, role)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, email, role, created_at;
	`
	err = tx.QueryRow(ctx, insertUserQuery, req.Name, req.Email, hashedPassword, req.Role).
		Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CreatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			w.WriteHeader(http.StatusConflict)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Email sudah terdaftar"})
			return
		}
		log.Printf("[ERROR] Register user insert failed: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Gagal menyimpan data pengguna"})
		return
	}

	var store *StoreResponse
	if req.Role == "seller" {
		storeName := strings.TrimSpace(req.StoreName)
		if storeName == "" {
			storeName = "Toko " + user.Name
		}

		store = &StoreResponse{
			UserID:      user.ID,
			Name:        storeName,
			Description: req.Description,
			Address:     req.Address,
			IsVerified:  false,
		}

		insertStoreQuery := `
			INSERT INTO stores (user_id, name, description, address, is_verified)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, is_verified;
		`
		err = tx.QueryRow(ctx, insertStoreQuery, user.ID, store.Name, store.Description, store.Address, store.IsVerified).
			Scan(&store.ID, &store.IsVerified)
		if err != nil {
			log.Printf("[ERROR] Register store insert failed: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Gagal membuat profil toko"})
			return
		}
	}

	if err := tx.Commit(ctx); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Gagal commit transaksi"})
		return
	}

	token, err := auth.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Gagal menerbitkan token"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(AuthResponse{
		User:  user,
		Store: store,
		Token: token,
	})
}

// LoginHandler handles authentication for all roles (buyer, seller, admin).
func (s *Server) LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Metode tidak diizinkan"})
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Format request tidak valid"})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if req.Email == "" || req.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Email dan password wajib diisi"})
		return
	}

	if s.DB == nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Koneksi database tidak tersedia"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var user UserResponse
	var passwordHash string

	query := `
		SELECT id, name, email, password_hash, role, created_at
		FROM users
		WHERE email = $1;
	`
	err := s.DB.QueryRow(ctx, query, req.Email).
		Scan(&user.ID, &user.Name, &user.Email, &passwordHash, &user.Role, &user.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			w.WriteHeader(http.StatusUnauthorized)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Email atau password salah"})
			return
		}
		log.Printf("[ERROR] Login query failed: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Terjadi kesalahan sistem saat memproses login"})
		return
	}

	if !auth.CheckPasswordHash(req.Password, passwordHash) {
		w.WriteHeader(http.StatusUnauthorized)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Email atau password salah"})
		return
	}

	var store *StoreResponse
	if user.Role == "seller" {
		storeQuery := `
			SELECT id, user_id, name, description, address, is_verified
			FROM stores
			WHERE user_id = $1;
		`
		var sRes StoreResponse
		err := s.DB.QueryRow(ctx, storeQuery, user.ID).
			Scan(&sRes.ID, &sRes.UserID, &sRes.Name, &sRes.Description, &sRes.Address, &sRes.IsVerified)
		if err == nil {
			store = &sRes
		}
	}

	token, err := auth.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Gagal menerbitkan token"})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(AuthResponse{
		User:  user,
		Store: store,
		Token: token,
	})
}
