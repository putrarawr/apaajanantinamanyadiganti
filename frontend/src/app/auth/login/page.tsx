"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import AuthShell from "@/components/auth/AuthShell";
import {
  FormAlert,
  GoogleIcon,
  PasswordField,
  SocialButton,
  SparkIcon,
  SubmitButton,
  TextField,
} from "@/components/auth/AuthUI";

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

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

const ROLE_BADGE: Record<User["role"], string> = {
  admin: "bg-violet-100 text-violet-700",
  seller: "bg-amber-100 text-amber-700",
  buyer: "bg-sky-100 text-sky-700",
};

const ROLE_LABEL: Record<User["role"], string> = {
  admin: "Admin",
  seller: "Penjual",
  buyer: "Pembeli",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_TIMEOUT_MS = 12000;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function focusField(ref: React.RefObject<HTMLInputElement | null>) {
  const node = ref.current;
  if (!node) return;
  node.focus({ preventScroll: true });
  node.scrollIntoView({ block: "center", behavior: "smooth" });
}

function LoginSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true">
      <span className="sr-only">Memeriksa sesi login...</span>
      <div className="h-6 w-3/4 rounded bg-[#F1F2F4]" />
      <div className="mt-3 h-3 w-full max-w-[19rem] rounded bg-[#F5F6F7]" />
      <div className="mt-9 space-y-7">
        {[0, 1].map((item) => (
          <div key={item}>
            <div className="h-2.5 w-14 rounded bg-[#F1F2F4]" />
            <div className="mt-3.5 h-3 w-2/3 rounded bg-[#F5F6F7]" />
            <div className="mt-3 h-px w-full bg-[#E9EAEC]" />
          </div>
        ))}
      </div>
      <div className="mt-9 h-11 w-full rounded-lg bg-[#F5F6F7]" />
      <div className="mt-3 h-11 w-full rounded-lg bg-[#F5F6F7]" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apiUrl = getApiBaseUrl();

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedStore = localStorage.getItem("auth_store");
    if (savedUser) {
      try {
        // Sinkronisasi sesi dari localStorage setelah komponen ter-mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(JSON.parse(savedUser));
        if (savedStore) setCurrentStore(JSON.parse(savedStore));
      } catch {
        // ignore
      }
    }
    // Penanda bahwa pembacaan sesi sudah selesai, supaya skeleton berhenti.
    setSessionChecked(true);
  }, []);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const clearFieldError = (field: keyof LoginFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_store");
    setCurrentUser(null);
    setCurrentStore(null);
    setShowLoginForm(false);
    setSuccessMsg("Berhasil keluar dari akun.");
    setErrorMsg("");
    setNoticeMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setNoticeMsg("");

    const nextErrors: LoginFieldErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Format email belum benar, contoh: nama@email.com.";
    }
    if (!password) {
      nextErrors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      nextErrors.password = "Password minimal 6 karakter.";
    }

    setFieldErrors(nextErrors);

    if (nextErrors.email) {
      focusField(emailRef);
      return;
    }
    if (nextErrors.password) {
      focusField(passwordRef);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
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
      setShowLoginForm(false);
      setSuccessMsg(
        `Berhasil masuk sebagai ${data.user.name}. Mengalihkan ke beranda...`
      );

      redirectTimer.current = setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setErrorMsg("Koneksi lambat. Periksa jaringanmu lalu coba lagi.");
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan koneksi.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail("admin@umkm.local");
    setPassword("AdminPassword123!");
    setFieldErrors({});
    setErrorMsg("");
    setSuccessMsg("");
    setNoticeMsg("Kredensial admin demo sudah diisi. Tekan Masuk untuk lanjut.");
  };

  const handleForgotPassword = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setNoticeMsg(
      "Untuk mengatur ulang password, hubungi admin Sentra di cs@sentra.id."
    );
  };

  const handleSocialLogin = (provider: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setNoticeMsg(
      `Masuk dengan ${provider} belum tersedia. Silakan gunakan email dan password dulu, ya.`
    );
  };

  const isSessionActive = Boolean(currentUser) && !showLoginForm;

  return (
    <AuthShell>
      {!sessionChecked ? (
        <LoginSkeleton />
      ) : (
        <>
          <div>
            <h1 className="text-[1.65rem] font-extrabold leading-tight tracking-[-0.025em] text-[#111827]">
              {isSessionActive ? "Kamu Sudah Masuk" : "Selamat Datang Kembali!"}
            </h1>
            {isSessionActive ? (
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#9CA3AF]">
                Lanjutkan aktivitasmu di pasar UMKM Nusantara.
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#9CA3AF]">
                Belum punya akun?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-[#FF8F00] transition-colors hover:underline"
                >
                  Buat akun baru
                </Link>{" "}
                sekarang. Gratis, kurang dari satu menit.
              </p>
            )}
          </div>

          {(errorMsg || successMsg || noticeMsg) && (
            <div className="mt-5 space-y-2">
              {errorMsg && <FormAlert tone="error">{errorMsg}</FormAlert>}
              {successMsg && <FormAlert tone="success">{successMsg}</FormAlert>}
              {noticeMsg && <FormAlert tone="info">{noticeMsg}</FormAlert>}
            </div>
          )}

          {/* Kartu sesi aktif */}
          {isSessionActive && currentUser && (
            <div className="auth-fade-up mt-6">
              <div className="overflow-hidden rounded-lg border border-[#FFE7C7] bg-[#FFF8EE]">
                <div className="flex items-center gap-3 p-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FF8F00] text-sm font-bold text-white">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#A1866A]">
                      Sesi login aktif
                    </p>
                    <p className="mt-0.5 truncate text-[13px] font-bold text-[#1A1A1A]">
                      {currentUser.name}
                    </p>
                    <p className="truncate text-[11px] text-[#9A8E84]">
                      {currentUser.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wide ${
                      ROLE_BADGE[currentUser.role] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ROLE_LABEL[currentUser.role] ?? currentUser.role}
                  </span>
                </div>

                {currentStore && (
                  <div className="mx-4 mb-4 flex items-center gap-2 rounded-md bg-white/80 px-3 py-2.5 text-[11px] text-[#8A4A12]">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#FFEBCF] text-[#FF8F00]">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M4 9.5V20h16V9.5" />
                        <path d="M3 9.5 5 4h14l2 5.5a3 3 0 0 1-5.5 1.6 3 3 0 0 1-5 0A3 3 0 0 1 3 9.5Z" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      Toko:{" "}
                      <span className="font-semibold">{currentStore.name}</span>
                      {!currentStore.is_verified && (
                        <span className="ml-1.5 rounded bg-[#FFF0DA] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#B45309]">
                          Menunggu verifikasi
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <Link
                href="/"
                className="mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-[#FF8F00] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#F08300]"
              >
                Lanjut ke beranda
              </Link>

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginForm(true);
                    setNoticeMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[#6B7280] transition-colors hover:text-[#FF8F00]"
                >
                  Masuk dengan akun lain
                </button>
                <span className="h-3 w-px bg-[#E5E7EB]" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-rose-500 transition-colors hover:text-rose-600"
                >
                  Keluar
                </button>
              </div>
            </div>
          )}

          {/* Form login */}
          {!isSessionActive && (
            <div className="auth-fade-up">
              {currentUser && (
                <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2">
                  <p className="truncate text-[10.5px] text-[#9CA3AF]">
                    Sesi <span className="font-semibold">{currentUser.name}</span>{" "}
                    masih aktif
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="shrink-0 text-[10.5px] font-bold text-[#FF8F00] hover:underline"
                  >
                    Kembali
                  </button>
                </div>
              )}

              <form
                onSubmit={handleLogin}
                noValidate
                className="mt-7 space-y-5"
              >
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                  autoComplete="email"
                  inputRef={emailRef}
                  error={fieldErrors.email}
                  autoFocus
                  required
                />

                <PasswordField
                  label="Password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  autoComplete="current-password"
                  inputRef={passwordRef}
                  error={fieldErrors.password}
                  required
                />

                <div className="pt-1">
                  <SubmitButton loading={loading} loadingText="Memproses...">
                    Masuk Sekarang
                  </SubmitButton>
                </div>
              </form>

              <div className="mt-3">
                <SocialButton
                  icon={<GoogleIcon className="h-4 w-4" />}
                  onClick={() => handleSocialLogin("Google")}
                >
                  Masuk dengan Google
                </SocialButton>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="text-[10.5px] text-[#9CA3AF]">
                  Butuh bantuan?{" "}
                  <a
                    href="mailto:cs@sentra.id"
                    className="font-semibold text-[#111827] transition-colors hover:text-[#FF8F00]"
                  >
                    cs@sentra.id
                  </a>
                </p>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10.5px] font-medium text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
                >
                  Lupa password?{" "}
                  <span className="font-semibold text-[#111827]">
                    Klik di sini
                  </span>
                </button>
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#E5E7EB] px-3 py-1.5 text-[10px] font-semibold text-[#9CA3AF] transition-colors hover:border-[#FF8F00]/40 hover:text-[#FF8F00]"
                >
                  <SparkIcon className="h-3 w-3" />
                  Isi akun admin demo
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AuthShell>
  );
}
