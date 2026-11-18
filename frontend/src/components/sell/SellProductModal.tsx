"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { ProductItem } from "@/app/page";

interface StoreData {
  id?: string;
  name?: string;
  address?: string;
  description?: string;
}

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductItem) => void;
  categories?: string[];
  locations?: string[];
  authUser?: { name: string; role: string } | null;
}

const DEFAULT_CATEGORIES = [
  "Batik & Kain Tenun",
  "Anyaman & Kerajinan Rotan",
  "Herbal & Minyak Atsiri",
  "Biji Kopi Lokal & Rempah",
  "Gerabah & Keramik Kasongan",
  "Peralatan Kayu Jati",
];

const DEFAULT_LOCATIONS = [
  "Ponorogo",
  "Kupang",
  "Aceh Tengah",
  "Karanganyar",
  "Bantul",
  "Sumbawa",
  "Jepara",
  "Rembang",
  "Magelang",
  "Pekalongan",
  "Tana Toraja",
  "Cirebon",
  "Bandung",
  "Yogyakarta",
  "Solo",
  "Bali",
];

const CURATED_TAGS = [
  "Handmade",
  "Karya Asli",
  "100% Organik",
  "Binaan UMKM",
  "Ready Stock",
];

const DEMO_PRESETS = [
  {
    label: "Anyaman Jali",
    tag: "Handmade",
    category: "Anyaman & Kerajinan Rotan",
    name: "Tas Anyaman Jali Pastel Premium",
    price: "75000",
    location: "Ponorogo",
    image:
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
    description:
      "Tas anyaman jali tangan pengrajin lokal. Kuat, lentur, tahan air, dan mudah dibersihkan.",
  },
  {
    label: "Batik Tulis",
    tag: "Karya Asli",
    category: "Batik & Kain Tenun",
    name: "Kain Batik Tulis Motif Parang Alami",
    price: "245000",
    location: "Pekalongan",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    description:
      "Batik tulis canting tradisional dengan pewarna alami rempah dan kulit kayu.",
  },
  {
    label: "Kopi Gayo",
    tag: "100% Organik",
    category: "Biji Kopi Lokal & Rempah",
    name: "Biji Kopi Arabika Gayo Specialty 250g",
    price: "85000",
    location: "Aceh Tengah",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    description:
      "Kopi arabika single origin dataran tinggi Gayo. Notes fruity, cokelat, dan aroma segar.",
  },
  {
    label: "Keramik Kasongan",
    tag: "Binaan UMKM",
    category: "Gerabah & Keramik Kasongan",
    name: "Vas Keramik Terracotta Minimalis",
    price: "115000",
    location: "Bantul",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    description:
      "Vas gerabah tanah liat alami Kasongan Yogyakarta dengan sentuhan rustic modern.",
  },
];

const LABEL_CLASS = "text-[13px] font-medium text-slate-700";
const HELPER_CLASS = "mt-1.5 text-[12px] text-slate-400";
const ERROR_CLASS = "mt-1.5 text-[12px] font-medium text-rose-600";

function fieldClass(hasError?: string) {
  const base =
    "w-full rounded-lg border bg-white text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2";
  return hasError
    ? `${base} border-rose-300 focus:border-rose-400 focus:ring-rose-500/10`
    : `${base} border-slate-200 hover:border-slate-300 focus:border-[#FF6801] focus:ring-[#FF6801]/15`;
}

interface FormState {
  name: string;
  price: string;
  category: string;
  sellerName: string;
  location: string;
  condition: string;
  description: string;
  imageTag: string;
  image: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  price: "",
  category: DEFAULT_CATEGORIES[0],
  sellerName: "",
  location: "",
  condition: "Baru",
  description: "",
  imageTag: "Handmade",
  image: "",
};

function normalizeHandle(val: string): string {
  return val
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9._\s-]/g, "")
    .replace(/[\s_-]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 30);
}

function getInitials(handle: string): string {
  const parts = handle.split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function SellProductModal({
  isOpen,
  onClose,
  onAddProduct,
  categories = DEFAULT_CATEGORIES,
  locations = DEFAULT_LOCATIONS,
  authUser,
}: SellProductModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageTab, setImageTab] = useState<"file" | "url">("file");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [savedStore, setSavedStore] = useState<StoreData | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cek apakah ada profil toko di localStorage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const rawStore = localStorage.getItem("auth_store");
      if (rawStore) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedStore(JSON.parse(rawStore));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  // Autofill data toko jika user belum mengisi nama toko / kota
  const applyStoreData = useCallback(() => {
    const storeName = savedStore?.name || authUser?.name || "";
    const storeLocation = savedStore?.address || "";
    setForm((prev) => ({
      ...prev,
      sellerName: prev.sellerName || storeName,
      location: prev.location || storeLocation,
    }));
  }, [savedStore, authUser]);

  // Periksa apakah form mengalami perubahan
  const isDirty = useMemo(() => {
    const keys = Object.keys(INITIAL_FORM) as (keyof FormState)[];
    return keys.some((k) => form[k] !== INITIAL_FORM[k]);
  }, [form]);

  // Fokuskan input pertama saat modal terbuka & trap scroll body
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 60);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setShowDiscardConfirm(false);
    setIsSubmitting(false);
  }, []);

  const handleRequestClose = useCallback(() => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      resetForm();
      onClose();
    }
  }, [isDirty, onClose, resetForm]);

  // Keyboard navigation & accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (showDiscardConfirm) {
          setShowDiscardConfirm(false);
        } else {
          handleRequestClose();
        }
      }
    },
    [handleRequestClose, showDiscardConfirm]
  );

  const updateField = (patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(patch)) {
        delete next[k as keyof FormState];
      }
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Berkas harus berupa gambar (JPG, PNG, WebP)" }));
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Ukuran gambar maksimal 2.5 MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField({ image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const applyDemoPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    updateField({
      name: preset.name,
      price: preset.price,
      category: preset.category,
      imageTag: preset.tag,
      image: preset.image,
      location: preset.location,
      description: preset.description,
      sellerName: form.sellerName || "kriya.sentra",
    });
  };

  const formattedPrice = useMemo(() => {
    if (!form.price) return "";
    return Number(form.price).toLocaleString("id-ID");
  }, [form.price]);

  const addPriceDelta = (delta: number) => {
    const cur = Number(form.price) || 0;
    const next = Math.max(0, cur + delta);
    updateField({ price: String(next) });
  };

  const sellerHandle = useMemo(() => normalizeHandle(form.sellerName), [form.sellerName]);
  const sellerInitials = useMemo(() => getInitials(sellerHandle), [sellerHandle]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    const name = form.name.trim();
    const price = Number(form.price);
    const handle = normalizeHandle(form.sellerName);

    if (!form.image.trim()) {
      nextErrors.image = "Foto produk wajib disertakan agar pembeli dapat melihat karya Anda.";
    }

    if (name.length < 6) {
      nextErrors.name = "Nama produk minimal 6 karakter.";
    } else if (name.length > 80) {
      nextErrors.name = "Nama produk maksimal 80 karakter.";
    }

    if (!form.price || !price || price < 1000) {
      nextErrors.price = "Harga jual minimal Rp 1.000.";
    }

    if (!handle) {
      nextErrors.sellerName = "Nama toko / pengrajin wajib diisi.";
    } else if (handle.length < 3) {
      nextErrors.sellerName = "Nama toko minimal 3 karakter.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Kota atau daerah asal produk wajib diisi.";
    }

    if (form.description.length > 500) {
      nextErrors.description = "Deskripsi maksimal 500 karakter.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      // Scroll to error field if on mobile
      const firstErr = Object.keys(errors)[0];
      if (firstErr) {
        document.getElementById(`sell-field-${firstErr}`)?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    const newProd: ProductItem = {
      id: String(Date.now()),
      sellerInitials,
      sellerColor: "bg-[#FF6801]",
      sellerName: sellerHandle || "mitra.umkm",
      timeAgo: "Baru saja",
      badge: "Asli Pengrajin",
      badgeColor: "text-[#D97706] border-[#D97706]/30 bg-amber-50/50",
      image: form.image,
      imageTag: form.imageTag,
      name: form.name.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      condition: form.condition,
      location: form.location.trim(),
      likes: 1,
      description:
        form.description.trim() ||
        "Produk karya pengrajin lokal berkualitas tinggi dari Sentra UMKM.",
    };

    onAddProduct(newProd);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm transition-all sm:items-center sm:p-4"
      onClick={handleRequestClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sell-modal-title"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-4xl flex-col rounded-t-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-200 sm:max-h-[90vh] sm:rounded-2xl"
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <h2 id="sell-modal-title" className="text-[17px] font-semibold text-slate-900">
              Pasang Produk Baru
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Pajang karyamu agar mudah ditemukan pembeli dari seluruh Nusantara.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            aria-label="Tutup form jual produk"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notifikasi Toko Terhubung jika Seller Login */}
        {savedStore?.name && (
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-6 py-2.5 sm:px-8">
            <p className="truncate text-[12px] text-slate-500">
              <span className="font-medium text-slate-700">{savedStore.name}</span>
              {savedStore.address && (
                <span className="text-slate-400"> · {savedStore.address}</span>
              )}
            </p>
            <button
              type="button"
              onClick={applyStoreData}
              className="shrink-0 text-[12px] font-medium text-[#E65100] transition hover:underline"
            >
              Gunakan data ini
            </button>
          </div>
        )}

        {/* Content Body: Two Columns */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
              {/* KOLOM KIRI: FORM INPUT */}
              <div className="space-y-7">
                {/* 1. FOTO PRODUK */}
                <section>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="text-[13px] font-semibold text-slate-900">Foto produk</h3>
                      <p className="mt-0.5 text-[12px] text-slate-500">
                        Gunakan foto terang dengan latar sederhana.
                      </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[12px]">
                      <button
                        type="button"
                        onClick={() => setImageTab("file")}
                        aria-pressed={imageTab === "file"}
                        className={`rounded-md px-2.5 py-1 transition ${
                          imageTab === "file"
                            ? "bg-white font-medium text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Unggah berkas
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab("url")}
                        aria-pressed={imageTab === "url"}
                        className={`rounded-md px-2.5 py-1 transition ${
                          imageTab === "url"
                            ? "bg-white font-medium text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Tautan URL
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    {/* Preview Foto */}
                    {form.image ? (
                      <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.image}
                            alt="Pratinjau foto produk"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-medium text-white">
                            {form.imageTag}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-slate-800">Foto siap tampil</p>
                          <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">
                            Foto ini menjadi tampilan utama pada kartu produk.
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-[12px]">
                            <label className="cursor-pointer font-medium text-slate-700 transition hover:text-[#E65100]">
                              Ganti foto
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                            </label>
                            <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
                            <button
                              type="button"
                              onClick={() => updateField({ image: "" })}
                              className="font-medium text-slate-500 transition hover:text-rose-600"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : imageTab === "file" ? (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center transition hover:border-[#FF6801] hover:bg-orange-50/30">
                        <svg
                          className="h-6 w-6 text-slate-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <p className="mt-2.5 text-[13px] font-medium text-slate-800">
                          Pilih foto produk
                        </p>
                        <p className="mt-0.5 text-[12px] text-slate-400">
                          JPG, PNG, atau WebP · maksimal 2,5 MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    ) : (
                      <div>
                        <input
                          id="sell-field-image"
                          type="url"
                          value={form.image}
                          onChange={(e) => updateField({ image: e.target.value })}
                          placeholder="https://..."
                          className={`${fieldClass(errors.image)} h-11 px-3`}
                        />
                        <p className={HELPER_CLASS}>
                          Gunakan tautan gambar yang dapat diakses publik.
                        </p>
                      </div>
                    )}
                  </div>

                  {errors.image && (
                    <p className={`${ERROR_CLASS} flex items-center gap-1.5`}>
                      <svg
                        className="h-3.5 w-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.image}
                    </p>
                  )}

                  {/* Contoh cepat */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px]">
                    <span className="text-slate-400">Contoh cepat:</span>
                    {DEMO_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyDemoPreset(p)}
                        className="text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-[#E65100] hover:decoration-[#E65100]"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </section>

                {/* 2. DETAIL PRODUK */}
                <section className="space-y-4 border-t border-slate-100 pt-6">
                  <h3 className="text-[13px] font-semibold text-slate-900">Detail produk</h3>

                  {/* Nama Produk */}
                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <label htmlFor="sell-field-name" className={LABEL_CLASS}>
                        Nama produk <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">{form.name.length}/80</span>
                    </div>
                    <input
                      id="sell-field-name"
                      ref={nameInputRef}
                      type="text"
                      maxLength={80}
                      value={form.name}
                      onChange={(e) => updateField({ name: e.target.value })}
                      placeholder="Contoh: Tas Anyaman Jali Ukuran M - Warna Sage"
                      className={`${fieldClass(errors.name)} h-11 px-3`}
                    />
                    {errors.name && <p className={ERROR_CLASS}>{errors.name}</p>}
                  </div>

                  {/* Kategori & Label Kurasi */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sell-field-category" className={`${LABEL_CLASS} mb-1.5 block`}>
                        Kategori <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="sell-field-category"
                        value={form.category}
                        onChange={(e) => updateField({ category: e.target.value })}
                        className={`${fieldClass()} h-11 pl-3 pr-8`}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="sell-field-imageTag" className={`${LABEL_CLASS} mb-1.5 block`}>
                        Label kurasi
                      </label>
                      <select
                        id="sell-field-imageTag"
                        value={form.imageTag}
                        onChange={(e) => updateField({ imageTag: e.target.value })}
                        className={`${fieldClass()} h-11 pl-3 pr-8`}
                      >
                        {CURATED_TAGS.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Kondisi & Harga */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <span className={`${LABEL_CLASS} mb-1.5 block`}>Kondisi</span>
                      <div className="inline-flex h-11 w-full items-center rounded-lg bg-slate-100 p-1">
                        {[
                          { id: "Baru", label: "Baru" },
                          { id: "Like new", label: "Like new" },
                        ].map((cond) => {
                          const active = form.condition === cond.id;
                          return (
                            <button
                              key={cond.id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => updateField({ condition: cond.id })}
                              className={`h-full flex-1 rounded-md text-[13px] transition ${
                                active
                                  ? "bg-white font-medium text-slate-900 shadow-sm"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              {cond.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-baseline justify-between gap-2">
                        <label htmlFor="sell-field-price" className={LABEL_CLASS}>
                          Harga jual <span className="text-rose-500">*</span>
                        </label>
                        {!errors.price && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>Tambah:</span>
                            {[10000, 50000, 100000].map((delta) => (
                              <button
                                key={delta}
                                type="button"
                                onClick={() => addPriceDelta(delta)}
                                className="font-medium text-slate-500 transition hover:text-[#E65100]"
                              >
                                +{delta / 1000}rb
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">
                          Rp
                        </span>
                        <input
                          id="sell-field-price"
                          type="text"
                          inputMode="numeric"
                          value={formattedPrice}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                            updateField({ price: clean });
                          }}
                          placeholder="65.000"
                          className={`${fieldClass(errors.price)} h-11 pl-9 pr-3 font-medium`}
                        />
                      </div>
                      {errors.price && <p className={ERROR_CLASS}>{errors.price}</p>}
                    </div>
                  </div>

                  {/* Deskripsi Produk */}
                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <label htmlFor="sell-field-description" className={LABEL_CLASS}>
                        Deskripsi <span className="font-normal text-slate-400">(opsional)</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {form.description.length}/500
                      </span>
                    </div>
                    <textarea
                      id="sell-field-description"
                      rows={3}
                      maxLength={500}
                      value={form.description}
                      onChange={(e) => updateField({ description: e.target.value })}
                      placeholder="Ceritakan bahan, keunikan motif, atau pesan dari pengrajin."
                      className={`${fieldClass(errors.description)} resize-none px-3 py-2.5 leading-relaxed`}
                    />
                    {errors.description && <p className={ERROR_CLASS}>{errors.description}</p>}
                  </div>
                </section>

                {/* 3. INFORMASI PENJUAL */}
                <section className="border-t border-slate-100 pt-6">
                  <h3 className="mb-4 text-[13px] font-semibold text-slate-900">
                    Informasi penjual
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="sell-field-sellerName"
                        className={`${LABEL_CLASS} mb-1.5 block`}
                      >
                        Nama toko <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">
                          @
                        </span>
                        <input
                          id="sell-field-sellerName"
                          type="text"
                          maxLength={30}
                          value={form.sellerName}
                          onChange={(e) => updateField({ sellerName: e.target.value })}
                          placeholder="kriya.pandan.asli"
                          className={`${fieldClass(errors.sellerName)} h-11 pl-7 pr-3`}
                        />
                      </div>
                      {errors.sellerName ? (
                        <p className={ERROR_CLASS}>{errors.sellerName}</p>
                      ) : (
                        <p className={HELPER_CLASS}>
                          Tampil sebagai{" "}
                          <span className="text-slate-600">@{sellerHandle || "nama.toko"}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="sell-field-location"
                        className={`${LABEL_CLASS} mb-1.5 block`}
                      >
                        Kota asal <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="sell-field-location"
                        type="text"
                        list="sell-modal-locations"
                        value={form.location}
                        onChange={(e) => updateField({ location: e.target.value })}
                        placeholder="Pilih atau ketik kota"
                        className={`${fieldClass(errors.location)} h-11 px-3`}
                      />
                      <datalist id="sell-modal-locations">
                        {locations.map((loc) => (
                          <option key={loc} value={loc} />
                        ))}
                      </datalist>
                      {errors.location && <p className={ERROR_CLASS}>{errors.location}</p>}
                    </div>
                  </div>
                </section>
              </div>

              {/* KOLOM KANAN: LIVE PREVIEW KARTU PRODUK */}
              <div className="hidden lg:block">
                <div className="sticky top-0 space-y-4">
                  <span className="text-[12px] font-medium text-slate-500">Pratinjau kartu</span>

                  {/* KARTU PREVIEW */}
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                      {form.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.image}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center p-6 text-center text-slate-400">
                          <div>
                            <svg
                              className="mx-auto mb-1 h-7 w-7 text-slate-300"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              aria-hidden="true"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span className="text-[12px]">Foto produk tampil di sini</span>
                          </div>
                        </div>
                      )}

                      <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {form.imageTag}
                      </span>

                      <span className="absolute right-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                        {form.condition}
                      </span>
                    </div>

                    <div className="space-y-2 p-4">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FF6801] text-[9px] font-semibold text-white">
                          {sellerInitials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-medium text-slate-700">
                            @{sellerHandle || "toko.umkm"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {form.location.trim() || "Kota pengrajin"} · Baru saja
                          </p>
                        </div>
                      </div>

                      <h4 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-snug text-slate-900">
                        {form.name.trim() || "Nama produk karya lokal Anda"}
                      </h4>

                      <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
                        <span className="text-[13px] font-semibold text-[#E65100]">
                          {formattedPrice ? `Rp ${formattedPrice}` : "Rp -"}
                        </span>
                        <span className="max-w-[45%] truncate text-[10px] text-slate-500">
                          {form.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <p className="text-[12px] font-medium text-slate-500">Tips</p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-slate-500">
                      <li>Gunakan pencahayaan alami untuk foto produk.</li>
                      <li>Sertakan ukuran atau dimensi di deskripsi.</li>
                      <li>Pilih kota asal yang tepat untuk hitungan ongkir.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Modal Action */}
          <div className="border-t border-slate-100 bg-white px-6 py-4 sm:px-8">
            {showDiscardConfirm ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                <p className="text-[13px] text-rose-800">
                  Ada perubahan yang belum disimpan. Yakin ingin membatalkan?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDiscardConfirm(false)}
                    className="h-9 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition hover:bg-white"
                  >
                    Lanjutkan mengisi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="h-9 rounded-lg bg-rose-600 px-3 text-[13px] font-medium text-white transition hover:bg-rose-700"
                  >
                    Buang perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="hidden text-[12px] text-slate-400 sm:block">
                  Produk langsung tampil di katalog publik.
                </p>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRequestClose}
                    className="h-10 rounded-lg px-4 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-10 min-w-[9.5rem] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FF6801] px-5 text-[13px] font-semibold text-white transition hover:bg-[#E65E00] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Memasang...</span>
                      </>
                    ) : (
                      "Pasang produk"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
