"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  category: string;
}

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<string>("Memeriksa koneksi ke Backend Go...");
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    async function checkBackend() {
      try {
        const resHealth = await fetch(`${apiUrl}/health`);
        if (!resHealth.ok) throw new Error("Backend response error");
        const healthData = await resHealth.json();
        setHealthStatus(healthData.message || "Terkoneksi ke Backend Go");
        setIsBackendConnected(true);

        const resProducts = await fetch(`${apiUrl}/products`);
        if (resProducts.ok) {
          const productsData = await resProducts.json();
          setProducts(productsData);
        }
      } catch {
        setHealthStatus("Gagal terhubung ke Backend Go (Pastikan backend berjalan di port 8080)");
        setIsBackendConnected(false);
      } finally {
        setLoading(false);
      }
    }

    checkBackend();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">UMKM Marketplace</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">Starter</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Status Backend:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isBackendConnected
                  ? "bg-green-100 text-green-700"
                  : isBackendConnected === false
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected
                    ? "bg-green-500 animate-pulse"
                    : isBackendConnected === false
                    ? "bg-rose-500"
                    : "bg-amber-500 animate-bounce"
                }`}
              />
              {isBackendConnected ? "Online" : isBackendConnected === false ? "Offline" : "Checking..."}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Setup Project UMKM Marketplace Berhasil 🎉
          </h1>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Boilerplate untuk frontend (Next.js 16 + Tailwind CSS) dan backend (Golang API) sudah siap.
          </p>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
            <p className="font-semibold text-slate-700">Pesan dari API ({apiUrl}/health):</p>
            <p className={`mt-1 font-mono text-xs ${isBackendConnected ? "text-emerald-700" : "text-rose-600"}`}>
              {healthStatus}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Contoh Produk UMKM dari Backend API</h2>
            <span className="text-xs text-slate-500 font-mono">Endpoint: /api/products</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              Memuat data produk...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="text-xs uppercase tracking-wider font-semibold text-emerald-600">{p.category}</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Penjual: {p.seller}</p>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-lg font-extrabold text-slate-900">
                      Rp {p.price.toLocaleString("id-ID")}
                    </span>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              Tidak ada produk ditemukan (atau backend belum dinyalakan).
            </div>
          )}
        </section>

        <section className="bg-slate-900 text-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white">Cara Menjalankan Project:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <p className="text-emerald-400 font-bold mb-2">1. Backend (Go):</p>
              <pre className="text-slate-300">
                cd backend{"\n"}go run cmd/api/main.go
              </pre>
              <p className="text-slate-400 mt-2 text-[11px] font-sans">Berjalan di: http://localhost:8080</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <p className="text-emerald-400 font-bold mb-2">2. Frontend (Next.js):</p>
              <pre className="text-slate-300">
                cd frontend{"\n"}pnpm dev
              </pre>
              <p className="text-slate-400 mt-2 text-[11px] font-sans">Berjalan di: http://localhost:3000</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
