# UMKM Marketplace Platform (Monorepo Starter)

Starter workspace untuk web marketplace UMKM menggunakan **Next.js** di folder frontend dan **Golang** di backend.

---

## 📁 Struktur Project

```text
.
├── backend/                # Go API Server
│   ├── cmd/api/main.go     # Entry point server (port 8080)
│   ├── internal/api/       # Routing, Handler, CORS Middleware, & Unit Tests
│   └── go.mod
├── frontend/               # Next.js App Router (TypeScript, Tailwind CSS)
│   ├── src/app/            # App Router pages & layout
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── .env.local
└── docs/                   # Spesifikasi & rencana implementasi
```

---

## 🚀 Cara Menjalankan

### 1. Backend (Go)

Pastikan sudah terinstall Go (v1.22+).

```bash
cd backend
go run cmd/api/main.go
```

Server backend akan berjalan di: `http://localhost:8080`

**Endpoint API yang tersedia:**
- `GET /api/health` - Health check status API
- `GET /api/products` - Data produk mock UMKM

**Menjalankan Unit Test Backend:**
```bash
cd backend
go test -v ./...
```

---

### 2. Frontend (Next.js)

Pastikan sudah terinstall Node.js (v20+) dan `pnpm` (atau `npm`).

```bash
cd frontend
pnpm dev
```

Buka browser di: `http://localhost:3000`

Halaman frontend akan otomatis melakukan ping ke `http://localhost:8080/api/health` dan mengambil data dari `/api/products` untuk memverifikasi integrasi.
