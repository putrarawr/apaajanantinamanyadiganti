"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload: Record<string, string> = {
        name,
        email,
        password,
        role,
      };

      if (role === "seller") {
        if (storeName) payload.store_name = storeName;
        if (description) payload.description = description;
        if (address) payload.address = address;
      }

      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      if (data.store) {
        localStorage.setItem("auth_store", JSON.stringify(data.store));
      }

      setSuccessMsg(`Pendaftaran berhasil! Akun ${data.user.role} Anda sudah aktif.`);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
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
          Buat Akun Baru
        </h1>
        <p className="text-xs text-slate-500">
          Pilih role Anda untuk mulai berbelanja atau membuka toko UMKM
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Daftar Sebagai:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    role === "buyer"
                      ? "border-[#0071E3] bg-blue-50/50 ring-2 ring-[#0071E3]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">🛍️ Pembeli</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Jelajah & beli produk</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    role === "seller"
                      ? "border-[#0071E3] bg-blue-50/50 ring-2 ring-[#0071E3]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">🏪 Penjual UMKM</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Buka toko & jualan</div>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                *Role Admin tidak tersedia di pendaftaran publik.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition"
              />
            </div>

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
                placeholder="Minimal 6 karakter"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition"
              />
            </div>

            {/* Seller Specific Fields */}
            {role === "seller" && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">🏪 Data Toko UMKM:</div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Nama Toko (Opsional)
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Contoh: Toko Kopi Mandiri"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Kota / Alamat Toko (Opsional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Kota Bandung"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold tracking-wide transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            Sudah memiliki akun?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-[#0071E3] hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
