# UMKM Marketplace Initial Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a monorepo workspace for an UMKM marketplace containing a Go backend API server and a Next.js (App Router, TypeScript, Tailwind CSS) frontend, connected via verified health and product API endpoints.

**Architecture:** Monorepo structure with distinct `backend/` and `frontend/` directories. The Go backend exposes standard REST endpoints with CORS middleware; the Next.js frontend fetches and renders backend health status and mock product catalog data.

**Tech Stack:** 
- Backend: Go 1.26, standard library `net/http` (clean package architecture)
- Frontend: Next.js 15+, React 19, TypeScript, Tailwind CSS, App Router
- Workspace: Git, Bash

**Spec:** Direct user specification for initial project setup (Go backend + Next.js frontend + API connectivity boilerplate without business logic).

## Global Constraints

- Backend must listen on port 8080 by default (overridable via `PORT` environment variable).
- Backend must handle CORS properly so Next.js running on `localhost:3000` (or any origin in dev) can call API endpoints.
- Frontend must use Next.js App Router with TypeScript and Tailwind CSS.
- Both projects must be fully buildable and testable with zero errors (`go test ./...` and `npm run build`).

## Review Focus

- Backend returns `Content-Type: application/json` for all API responses.
- CORS preflight `OPTIONS` requests receive appropriate 200/204 response with allowed headers and methods.
- Next.js handles graceful fallback if backend is offline or unreachable during initial render.
- Proper `.gitignore` setup at workspace root so neither Go binaries nor `node_modules`/`.next` are tracked.
- Relative imports and alias paths (`@/*`) properly configured and functional in frontend.

---

### Task 1: Go Backend Scaffolding and API Endpoints

**Files:**
- Create: `backend/go.mod`
- Create: `backend/cmd/api/main.go`
- Create: `backend/internal/api/middleware.go`
- Create: `backend/internal/api/handler.go`
- Create: `backend/internal/api/router.go`
- Test: `backend/internal/api/handler_test.go`

**Interfaces:**
- Produces:
  - `GET /api/health` -> `{"status":"ok","message":"Backend UMKM Marketplace API is running"}`
  - `GET /api/products` -> `[{"id":"1","name":"Kopi Arabika Gayo UMKM","price":35000,"seller":"Koperasi Tani Makmur","category":"Minuman"}]`
  - Function: `api.NewRouter() http.Handler`

- [ ] **Step 1: Initialize Go module**
  Run in `backend/`: `go mod init umkm-marketplace/backend`

- [ ] **Step 2: Write handler and router unit tests in `backend/internal/api/handler_test.go`**
  Write tests using `net/http/httptest` for `/api/health` (verify 200 OK, JSON status "ok") and `/api/products` (verify 200 OK, JSON array containing at least 1 product).

- [ ] **Step 3: Run test to verify it fails**
  Run: `cd backend && go test ./...`
  Expected: FAIL (packages not found / undefined)

- [ ] **Step 4: Implement middleware, handlers, and router**
  - Implement `internal/api/middleware.go`: `CORSMiddleware(next http.Handler) http.Handler` setting `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`, responding to `OPTIONS` method.
  - Implement `internal/api/handler.go`: `HealthHandler(w http.ResponseWriter, r *http.Request)` and `ProductsHandler(w http.ResponseWriter, r *http.Request)`.
  - Implement `internal/api/router.go`: `NewRouter() http.Handler` routing `/api/health` and `/api/products` wrapped in CORS middleware.
  - Implement `cmd/api/main.go`: Server entry point reading `PORT` (default 8080) and starting `http.ListenAndServe`.

- [ ] **Step 5: Run tests to verify they pass**
  Run: `cd backend && go test -v ./...`
  Expected: PASS

- [ ] **Step 6: Commit backend scaffolding**
  Run: `git add backend && git commit -m "feat(backend): setup go backend api with health and products endpoints"`

---

### Task 2: Next.js Frontend Scaffolding and API Integration

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/src/app/layout.tsx`
- Create: `frontend/src/app/page.tsx`
- Create: `frontend/.env.local`
- Create: `frontend/.env.example`

**Interfaces:**
- Consumes: Backend endpoints `http://localhost:8080/api/health` and `http://localhost:8080/api/products`

- [ ] **Step 1: Bootstrap Next.js with TypeScript and Tailwind CSS**
  Run in `frontend/`:
  `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes`

- [ ] **Step 2: Configure environment variables**
  - Create `frontend/.env.example` with `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
  - Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080/api`

- [ ] **Step 3: Implement landing page in `frontend/src/app/page.tsx`**
  - Modern dashboard/landing UI for UMKM Marketplace with Tailwind CSS.
  - Client component checking backend connection status (`/api/health`).
  - Product catalog section fetching and displaying mock products (`/api/products`).
  - Error state handling if the backend server is not running, with clear UI indicator.

- [ ] **Step 4: Verify frontend build**
  Run: `cd frontend && npm run build`
  Expected: Build succeeds with 0 errors.

- [ ] **Step 5: Commit frontend scaffolding**
  Run: `git add frontend && git commit -m "feat(frontend): setup next.js project with api integration"`

---

### Task 3: Root Workspace Configuration and Verification

**Files:**
- Modify: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Update `.gitignore`**
  Add root ignore rules for Go binaries (`backend/bin`, `*.exe`), Next.js (`frontend/.next`, `frontend/node_modules`, `frontend/.env*.local`), OS files (`.DS_Store`).

- [ ] **Step 2: Create root `README.md`**
  Document project architecture, prerequisites (Node 20+, Go 1.22+), how to run backend (`cd backend && go run cmd/api/main.go`), how to run frontend (`cd frontend && npm run dev`), and available API endpoints.

- [ ] **Step 3: End-to-end verification**
  - Run backend unit tests: `cd backend && go test ./...`
  - Run frontend build: `cd frontend && npm run build`
  - Start backend briefly in background and curl `/api/health` to verify live response.

- [ ] **Step 4: Commit root configuration**
  Run: `git add .gitignore README.md docs && git commit -m "chore: setup root gitignore, readme, and plan"`
