# Petunjuk AI Agent (AGENTS.md)

Dokumen ini adalah panduan wajib bagi setiap AI Coding Agent yang bekerja di repositori ini. Setiap agen **wajib membaca dan mematuhi** aturan di bawah ini sebelum melakukan perubahan atau commit kode.

---

## 🚨 Aturan Wajib Pesan Git Commit (PENTING)

1. **JANGAN GUNAKAN Conventional Commits:**
   - DILARANG menggunakan awalan seperti `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, `(feat)`, `(fix)`, dsb.
2. **Gunakan Bahasa Manusia yang Natural:**
   - Tulis pesan commit seperti seorang developer manusia yang menjelaskan pekerjaannya ke rekan tim.
   - Sebutkan secara jelas dan spesifik:
     - **Apa yang ditambahkan / diperbarui**, ATAU
     - **Apa yang diperbaiki** (jika berupa perbaikan bug/error).
3. **Bahasa:**
   - Gunakan Bahasa Indonesia yang lugas dan mudah dipahami (atau kalimat natural yang disepakati).

### Contoh Pesan Commit:

| ❌ Jangan Seperti Ini (Dilarang) | ✅ Gunakan Gaya Ini (Bahasa Manusia) |
| :--- | :--- |
| `feat(backend): setup postgresql` | `menambahkan koneksi database postgresql dan docker compose untuk tim` |
| `fix(frontend): fix socket timeout error` | `memperbaiki error socket timeout saat build dan download native package frontend` |
| `feat: add product api` | `membuat endpoint api untuk menampilkan daftar produk umkm` |
| `chore: update readme` | `memperbarui panduan menjalankan project pada readme` |
| `fix: cors issue on localhost` | `mengizinkan akses cors di backend agar frontend bisa fetch api` |

---

## 🛠️ Verifikasi Sebelum Melakukan Commit

Jangan pernah melakukan commit jika pengujian atau build masih gagal:

1. **Backend (Go):**
   ```bash
   cd backend && go test ./...
   ```
   Pastikan seluruh unit test lolos (`PASS`).

2. **Frontend (Next.js):**
   ```bash
   cd frontend && pnpm run build
   ```
   Pastikan build lolos tanpa error typecheck atau bundling.

---

## 📌 Ringkasan Arsitektur Project

- **Frontend:** Next.js (TypeScript, Tailwind CSS, App Router) di dalam folder `frontend/`.
- **Backend:** Golang (`net/http`, `jackc/pgx/v5`) di dalam folder `backend/`.
- **Database:** PostgreSQL melalui Docker Compose di root (`docker-compose.yml`, port lokal `5433`).
- **Domain Marketplace UMKM:**
  - Memiliki 3 Role pengguna:
    1. **Pembeli (Buyer):** Jelajah produk, keranjang, checkout, riwayat belanja.
    2. **Penjual (Seller / Mitra UMKM):** Kelola toko, katalog produk, proses pesanan masuk.
    3. **Admin:** Verifikasi toko UMKM, moderasi platform, monitoring transaksi.
  - Skema tabel database hanya ditambahkan jika sudah ada spesifikasi kebutuhan yang jelas.
