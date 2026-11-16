# UMKM Marketplace Platform (Monorepo Starter)

Starter workspace untuk web marketplace UMKM menggunakan **Next.js 16** di frontend dan **Golang + PostgreSQL** di backend.

---

## 📁 Struktur Project

```text
.
├── docker-compose.yml       # Service PostgreSQL (port 5433 -> 5432)
├── backend/                 # Go REST API
│   ├── cmd/api/main.go      # Server entry point (port 8080)
│   ├── internal/
│   │   ├── api/             # Routing, Handler, CORS Middleware, & Unit Tests
│   │   └── database/        # Koneksi pool PostgreSQL (pgx)
│   ├── go.mod
│   └── .env.example
├── frontend/                # Next.js App Router (TypeScript, Tailwind CSS)
│   ├── src/app/             # Pages, layout, UI terhubung ke backend
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── .env.local
└── README.md
```

---

## 🚀 Panduan Menjalankan Project (Untuk Teman Tim)

Hanya perlu 3 langkah agar project ini berjalan di laptop manapun (Linux, macOS, Windows):

### 1. Jalankan Database PostgreSQL (via Docker)
Pastikan Docker / Docker Desktop sudah berjalan di laptop, lalu jalankan:
```bash
docker compose up -d
```
> Database PostgreSQL otomatis aktif di port `5433` dengan database `umkm_marketplace` (bebas bentrok dengan PostgreSQL port default 5432).

Untuk mematikan container database kapan saja:
```bash
docker compose down
```

---

### 2. Jalankan Backend (Go)
Pastikan sudah terinstall Go (v1.22+).
```bash
cd backend
go run cmd/api/main.go
```
- Backend berjalan di: `http://localhost:8080`
- Otomatis membaca konfigurasi dari `backend/.env` (atau fallback ke default Docker port `5433`).
- **Endpoint Test:**
  - `GET /api/health` — Status API & koneksi PostgreSQL (`db_status: "connected"`).
  - `GET /api/products` — Data mock produk UMKM.

**Menjalankan Unit Test Backend:**
```bash
cd backend
go test -v ./...
```

---

### 3. Jalankan Frontend (Next.js)
Pastikan sudah terinstall Node.js (v20+) dan `pnpm` (atau `npm`).
```bash
cd frontend
pnpm dev
```
Buka browser di: **`http://localhost:3000`**
Halaman frontend akan langsung mendeteksi status backend secara otomatis.
