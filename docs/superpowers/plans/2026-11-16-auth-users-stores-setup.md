# Skema Database Auth dan API Login/Registrasi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementasi skema tabel PostgreSQL (`users` & `stores`), migrasi database, utility autentikasi (bcrypt & JWT), serta endpoint registrasi (buyer & seller) dan login (buyer, seller, admin) di backend Go.

**Architecture:** 
- Database: Tabel `users` dengan enum `user_role` (`buyer`, `seller`, `admin`), dan tabel relasi `stores` untuk profil toko UMKM.
- Backend: Modul autentikasi di `internal/auth/` (password hashing bcrypt & JWT token), modul database migration di `internal/database/`, dan HTTP handler di `internal/api/auth_handler.go`.
- Seeder: Default admin seeder otomatis pada startup agar admin dapat langsung login tanpa bisa didaftarkan dari registrasi publik.

**Tech Stack:** Go 1.26, PostgreSQL 16 (pgxpool), `golang.org/x/crypto/bcrypt`, `golang-jwt/jwt/v5`

**Spec:** Persetujuan chat: 1 tabel akun terpusat `users` + 1 tabel profil `stores`, registrasi publik hanya untuk buyer & seller, admin hanya bisa melalui login.

## Global Constraints

- **Git Commit Rule (Wajib AGENTS.md):** DILARANG menggunakan prefix Conventional Commits (`feat:`, `fix:`, dll.). Wajib menggunakan kalimat natural bahasa manusia dalam Bahasa Indonesia.
- **Verifikasi Wajib Sebelum Commit:** `cd backend && go test ./...` dan `cd frontend && pnpm run build` harus lolos tanpa error.
- **Registrasi Protection:** Endpoint `POST /api/auth/register` menolak jika role adalah `admin`.
- **Database Safety:** Menggunakan migrasi berbasis SQL terstruktur dengan validasi idempotensi (`IF NOT EXISTS`).

## Review Focus

- Registrasi dengan role `admin` wajib mengembalikan response HTTP 400 Bad Request.
- Registrasi dengan email yang sudah ada mengembalikan response HTTP 409 Conflict.
- Registrasi dengan role `seller` otomatis membuat entri record di tabel `stores`.
- Login dengan password yang salah mengembalikan HTTP 401 Unauthorized.
- Login admin (yang di-seed) berhasil mengembalikan JWT token dengan klaim `role: "admin"`.

---

### Task 1: Setup Library & Skema Migrasi Database (`users` & `stores`)

**Files:**
- Create: `backend/internal/database/migrations/000001_create_users_and_stores.sql`
- Modify: `backend/internal/database/migrate.go`
- Modify: `backend/internal/database/db.go`

**Interfaces:**
- Produces:
  - `database.RunMigrations(ctx context.Context, pool *pgxpool.Pool) error`
  - Tabel `users` dan tabel `stores` di PostgreSQL.

- [ ] **Step 1: Unduh library `golang.org/x/crypto` dan `golang-jwt/jwt/v5`**
  Run: `cd backend && go get golang.org/x/crypto/bcrypt github.com/golang-jwt/jwt/v5`

- [ ] **Step 2: Buat file SQL migration `backend/internal/database/migrations/000001_create_users_and_stores.sql`**
  Membuat enum `user_role`, tabel `users` (UUID pk, name, email unique, password_hash, role, created_at, updated_at), dan tabel `stores` (UUID pk, user_id fk users, name, description, address, is_verified, created_at, updated_at).

- [ ] **Step 3: Implementasikan migrator otomatis di `backend/internal/database/migrate.go`**
  Membaca file migration menggunakan `//go:embed` dan mengeksekusinya ke PostgreSQL dengan tabel tracking `schema_migrations`.

- [ ] **Step 4: Commit perubahan migrasi database**
  Pesan commit: `menyiapkan skema migrasi tabel users dan stores untuk autentikasi postgresql`

---

### Task 2: Modul Autentikasi (Bcrypt & JWT)

**Files:**
- Create: `backend/internal/auth/password.go`
- Create: `backend/internal/auth/jwt.go`
- Test: `backend/internal/auth/auth_test.go`

**Interfaces:**
- Produces:
  - `auth.HashPassword(password string) (string, error)`
  - `auth.CheckPasswordHash(password, hash string) bool`
  - `auth.GenerateToken(userID, email, role string) (string, error)`
  - `auth.ValidateToken(tokenString string) (*Claims, error)`

- [ ] **Step 1: Tulis unit test failing di `backend/internal/auth/auth_test.go`**
  Uji password hashing, verifikasi password benar/salah, pembuatan token JWT, dan ekstraksi klaim role.

- [ ] **Step 2: Jalankan test untuk memastikan test gagal (RED)**
  Run: `cd backend && go test ./internal/auth`
  Expected: FAIL

- [ ] **Step 3: Implementasikan `password.go` dan `jwt.go`**
  Menggunakan `bcrypt.DefaultCost` dan `jwt.SigningMethodHS256`.

- [ ] **Step 4: Jalankan test untuk memastikan test lolos (GREEN)**
  Run: `cd backend && go test -v ./internal/auth`
  Expected: PASS

- [ ] **Step 5: Commit modul auth**
  Pesan commit: `membuat modul hashing password bcrypt dan pembuatan token jwt`

---

### Task 3: Handler Register & Login serta Seeder Admin

**Files:**
- Create: `backend/internal/api/auth_handler.go`
- Modify: `backend/internal/api/router.go`
- Modify: `backend/cmd/api/main.go`
- Test: `backend/internal/api/auth_handler_test.go`

**Interfaces:**
- Produces:
  - `POST /api/auth/register` (hanya role `buyer` & `seller`)
  - `POST /api/auth/login` (semua role: `buyer`, `seller`, `admin`)
  - Auto-seeder default akun admin saat startup jika belum ada.

- [ ] **Step 1: Tulis test HTTP di `backend/internal/api/auth_handler_test.go`**
  - Test register buyer sukses (201 Created).
  - Test register dengan role admin ditolak (400 Bad Request).
  - Test register seller sukses dan verifikasi data toko (201 Created).
  - Test login kredensial valid (200 OK + JWT).
  - Test login kredensial salah (401 Unauthorized).

- [ ] **Step 2: Jalankan test HTTP untuk melihat failure (RED)**
  Run: `cd backend && go test -v ./internal/api -run TestAuth`
  Expected: FAIL (handler belum terdefinisi)

- [ ] **Step 3: Implementasikan `internal/api/auth_handler.go` dan routing**
  - Validasi request JSON.
  - Cek role: jika `admin`, return 400 dengan pesan "Role admin tidak diizinkan melalui registrasi publik".
  - Insert user, hash password, create store jika seller.
  - Implementasi seeder admin pada startup backend di `cmd/api/main.go`.

- [ ] **Step 4: Jalankan seluruh test backend dan build frontend**
  - Run: `cd backend && go test -v ./...` (Expected: PASS)
  - Run: `cd frontend && pnpm run build` (Expected: PASS)

- [ ] **Step 5: Commit fitur registrasi dan login**
  Pesan commit: `membuat endpoint registrasi dan login dengan validasi role serta seeder akun admin`
