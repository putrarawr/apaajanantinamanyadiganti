"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  is_verified: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  const apiUrl = getApiBaseUrl();

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedStore = localStorage.getItem("auth_store");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        if (savedStore) setCurrentStore(JSON.parse(savedStore));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_store");
    setCurrentUser(null);
    setCurrentStore(null);
    setSuccessMsg("Berhasil keluar dari akun.");
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk ke akun");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      if (data.store) {
        localStorage.setItem("auth_store", JSON.stringify(data.store));
      } else {
        localStorage.removeItem("auth_store");
      }

      setCurrentUser(data.user);
      setCurrentStore(data.store || null);
      setSuccessMsg(`Berhasil login sebagai ${data.user.name} (${data.user.role})!`);

      // Optional redirect after short delay
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan koneksi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail("admin@umkm.local");
    setPassword("AdminPassword123!");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071E3] hover:underline"
        >
          ← Kembali ke Beranda
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Masuk ke Akun
        </h1>
        <p className="text-xs text-slate-500">
          Akses portal pembeli, dashboard toko UMKM, atau panel admin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Existing Session Card */}
        {currentUser && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sesi Login Aktif
                </span>
                <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  currentUser.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : currentUser.role === "seller"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {currentUser.role.toUpperCase()}
              </span>
            </div>

            {currentStore && (
              <div className="p-2.5 bg-amber-50 rounded-lg text-xs text-amber-900">
                🏪 Toko: <span className="font-semibold">{currentStore.name}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <Link href="/" className="font-semibold text-[#0071E3] hover:underline">
                Ke Beranda →
              </Link>
              <button
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                Keluar (Logout)
              </button>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold tracking-wide transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>
          </form>

          {/* Quick Admin Test Button */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-xs text-[#0071E3] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              ⚡ Isi Otomatis Akun Admin Bawaan (Testing)
            </button>
          </div>

          {/* Switch to Register */}
          <div className="text-center text-xs text-slate-500 pt-2">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-[#0071E3] hover:underline"
            >
              Daftar sebagai Pembeli atau Penjual
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
