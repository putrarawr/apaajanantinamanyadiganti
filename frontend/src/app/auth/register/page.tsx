"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import AuthShell from "@/components/auth/AuthShell";
import {
  FormAlert,
  GoogleIcon,
  PasswordField,
  SocialButton,
  StoreIcon,
  SubmitButton,
  TextField,
  UserIcon,
} from "@/components/auth/AuthUI";

type Role = "buyer" | "seller";

interface RegisterFieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const ROLE_OPTIONS: { id: Role; label: string; icon: React.ReactNode }[] = [
  {
    id: "buyer",
    label: "Pembeli",
    icon: <UserIcon className="h-3.5 w-3.5" />,
  },
  {
    id: "seller",
    label: "Penjual UMKM",
    icon: <StoreIcon className="h-3.5 w-3.5" />,
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_TIMEOUT_MS = 12000;

function focusField(ref: React.RefObject<HTMLInputElement | null>) {
  const node = ref.current;
  if (!node) return;
  node.focus({ preventScroll: true });
  node.scrollIntoView({ block: "center", behavior: "smooth" });
}

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apiUrl = getApiBaseUrl();

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (
      (/[a-z]/.test(password) && /[A-Z]/.test(password)) ||
      (/\d/.test(password) && /[^A-Za-z0-9]/.test(password))
    ) {
      score += 1;
    }
    return Math.min(score, 3);
  }, [password]);

  const strengthMeta = [
    { label: "Terlalu pendek", color: "bg-rose-400", text: "text-rose-500" },
    { label: "Lemah", color: "bg-rose-400", text: "text-rose-500" },
    { label: "Cukup kuat", color: "bg-amber-400", text: "text-amber-600" },
    { label: "Kuat", color: "bg-emerald-500", text: "text-emerald-600" },
  ][passwordStrength];

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const clearFieldError = (field: keyof RegisterFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setNoticeMsg("");

    const nextErrors: RegisterFieldErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Nama lengkap wajib diisi.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Nama terlalu pendek.";
    }

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

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Ulangi password dulu.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Password belum sama.";
    }

    setFieldErrors(nextErrors);

    if (nextErrors.name) {
      focusField(nameRef);
      return;
    }
    if (nextErrors.email) {
      focusField(emailRef);
      return;
    }
    if (nextErrors.password) {
      focusField(passwordRef);
      return;
    }
    if (nextErrors.confirmPassword) {
      focusField(confirmPasswordRef);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        email: email.trim(),
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
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      if (data.store) {
        localStorage.setItem("auth_store", JSON.stringify(data.store));
      } else {
        localStorage.removeItem("auth_store");
      }

      setSuccessMsg(
        `Akun ${
          data.user.role === "seller" ? "penjual" : "pembeli"
        } berhasil dibuat. Mengalihkan ke beranda...`
      );
      redirectTimer.current = setTimeout(() => {
        router.push("/");
      }, 1400);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setErrorMsg("Koneksi lambat. Periksa jaringanmu lalu coba lagi.");
      } else if (err instanceof Error) {
        if (/sudah terdaftar/i.test(err.message)) {
          setFieldErrors((prev) => ({
            ...prev,
            email: "Email ini sudah terdaftar. Coba masuk atau pakai email lain.",
          }));
          focusField(emailRef);
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg("Terjadi kesalahan.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setNoticeMsg(
      `Pendaftaran dengan ${provider} belum tersedia. Silakan isi formulir di atas, ya.`
    );
  };

  return (
    <AuthShell>
      <div>
        <h1 className="text-[1.65rem] font-extrabold leading-tight tracking-[-0.025em] text-[#111827]">
          Buat Akun Baru!
        </h1>
        <p className="mt-1.5 text-[11px] leading-relaxed text-[#9CA3AF]">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[#FF8F00] transition-colors hover:underline"
          >
            Masuk di sini
          </Link>
          . Gratis, kurang dari satu menit.
        </p>
      </div>

      {(errorMsg || successMsg || noticeMsg) && (
        <div className="mt-5 space-y-2">
          {errorMsg && <FormAlert tone="error">{errorMsg}</FormAlert>}
          {successMsg && <FormAlert tone="success">{successMsg}</FormAlert>}
          {noticeMsg && <FormAlert tone="info">{noticeMsg}</FormAlert>}
        </div>
      )}

      <form onSubmit={handleRegister} noValidate className="mt-7 space-y-5">
        {/* Pilihan role */}
        <div>
          <div className="grid grid-cols-2 gap-6 border-b border-[#E5E7EB]">
            {ROLE_OPTIONS.map((option) => {
              const active = role === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  aria-pressed={active}
                  className={`relative flex items-center gap-1.5 pb-2.5 text-[11.5px] font-semibold transition-colors ${
                    active
                      ? "text-[#111827]"
                      : "text-[#9CA3AF] hover:text-[#6B7280]"
                  }`}
                >
                  {option.icon}
                  {option.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#FF8F00]" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[9.5px] text-[#B3ACA4]">
            Role admin hanya dibuat oleh tim internal Sentra.
          </p>
        </div>

        <TextField
          label="Nama lengkap"
          name="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          autoComplete="name"
          inputRef={nameRef}
          error={fieldErrors.name}
          autoFocus
          required
        />

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
          required
        />

        <div>
          <PasswordField
            label="Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
              clearFieldError("confirmPassword");
            }}
            autoComplete="new-password"
            inputRef={passwordRef}
            error={fieldErrors.password}
            hint="Minimal 6 karakter."
            minLength={6}
            required
          />

          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map((level) => (
                  <span
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      passwordStrength >= level
                        ? strengthMeta.color
                        : "bg-[#E5E7EB]"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`text-[9.5px] font-semibold ${strengthMeta.text}`}
              >
                {strengthMeta.label}
              </span>
            </div>
          )}
        </div>

        <PasswordField
          label="Ulangi password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearFieldError("confirmPassword");
          }}
          autoComplete="new-password"
          inputRef={confirmPasswordRef}
          error={
            fieldErrors.confirmPassword ||
            (passwordsMismatch ? "Password belum sama." : undefined)
          }
          minLength={6}
          required
        />

        {/* Data toko untuk penjual */}
        {role === "seller" && (
          <div className="auth-fade-up space-y-4 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[#FFEBCF] text-[#FF8F00]">
                <StoreIcon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#111827]">
                  Profil toko UMKM
                </p>
                <p className="text-[9.5px] text-[#9CA3AF]">
                  Bisa dilengkapi nanti dari dashboard.
                </p>
              </div>
            </div>

            <TextField
              label="Nama toko"
              name="store_name"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              hint="Opsional."
            />

            <TextField
              label="Kota atau alamat toko"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              hint="Opsional."
            />

            <div>
              <label htmlFor="store-description" className="sr-only">
                Deskripsi toko
              </label>
              <textarea
                id="store-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Ceritakan produk khas dan cerita UMKM kamu (opsional)"
                className="w-full resize-none rounded-md border border-[#D1D5DB] bg-white px-3 py-2.5 text-[12px] text-[#111827] outline-none transition placeholder:text-[#9CA3AF] hover:border-[#9CA3AF] focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00]/10"
              />
            </div>
          </div>
        )}

        <div className="pt-1">
          <SubmitButton loading={loading} loadingText="Mendaftarkan akun...">
            Daftar Sekarang
          </SubmitButton>
        </div>
      </form>

      <div className="mt-3">
        <SocialButton
          icon={<GoogleIcon className="h-4 w-4" />}
          onClick={() => handleSocialLogin("Google")}
        >
          Daftar dengan Google
        </SocialButton>
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-[#9CA3AF]">
        Dengan mendaftar, kamu menyetujui Syarat &amp; Ketentuan serta Kebijakan
        Privasi Sentra.
      </p>
    </AuthShell>
  );
}
