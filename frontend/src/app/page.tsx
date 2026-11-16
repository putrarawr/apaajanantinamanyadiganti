"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

export interface ProductItem {
  id: string;
  sellerInitials: string;
  sellerColor: string;
  sellerName: string;
  timeAgo: string;
  badge?: string;
  badgeColor?: string;
  image: string;
  imageTag?: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  likes: number;
  description?: string;
}

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "1",
    sellerInitials: "RK",
    sellerColor: "bg-[#1E1E1E]",
    sellerName: "ratna.kriya",
    timeAgo: "3 menit lalu",
    badge: "Kurasi Sentra",
    badgeColor: "text-[#FF6801] border-[#FF6801]/30 bg-orange-50/50",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
    imageTag: "Handmade",
    name: "Tas Anyaman Jali Ukuran M - Warna Sage Pastel Awet & Tahan Air",
    price: 65000,
    category: "Anyaman & Kerajinan Rotan",
    condition: "Baru",
    location: "Ponorogo",
    likes: 8,
    description: "Tas anyaman jali ukuran medium buatan tangan pengrajin Ponorogo. Kuat, elastis, mudah dibersihkan dan tahan air. Sangat cocok untuk pasar, piknik, maupun bepergian harian.",
  },
  {
    id: "2",
    sellerInitials: "NT",
    sellerColor: "bg-[#D97706]",
    sellerName: "nusantara.tenun",
    timeAgo: "14 menit lalu",
    badge: "Asli Pengrajin",
    badgeColor: "text-[#D97706] border-[#D97706]/30 bg-amber-50/50",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    imageTag: "Pewarna Alam",
    name: "Kain Tenun Ikat Asli NTT Motif Flores Tradisional Lembut",
    price: 320000,
    category: "Batik & Kain Tenun",
    condition: "Baru",
    location: "Kupang",
    likes: 24,
    description: "Kain tenun ikat asli Flores dengan bahan katun lembut berpola geometris tradisional. Menggunakan pewarna alami ramah lingkungan dari daun tarum dan akar mengkudu.",
  },
  {
    id: "3",
    sellerInitials: "KG",
    sellerColor: "bg-[#374151]",
    sellerName: "kopi.gayo.asli",
    timeAgo: "25 menit lalu",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
    name: "Biji Kopi Arabika Aceh Gayo Specialty Roast Bean 250gr Fresh Roasting",
    price: 85000,
    category: "Biji Kopi Lokal & Rempah",
    condition: "Baru",
    location: "Aceh Tengah",
    likes: 19,
    description: "Biji kopi arabika single origin dari dataran tinggi Takengon Aceh Gayo. Dipetik merah sempurna dengan proses full wash dan medium roast segar.",
  },
  {
    id: "4",
    sellerInitials: "AA",
    sellerColor: "bg-[#991B1B]",
    sellerName: "atsiri.alami",
    timeAgo: "1 jam lalu",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    name: "Minyak Atsiri Sereh Wangi Citronella Asli 100% Sulingan Petani",
    price: 45000,
    category: "Herbal & Minyak Atsiri",
    condition: "Baru",
    location: "Karanganyar",
    likes: 5,
    description: "Minyak atsiri sereh wangi murni tanpa pengencer. Berkhasiat untuk aromaterapi relaksasi, pengusir nyamuk alami, dan melegakan pernapasan.",
  },
  {
    id: "5",
    sellerInitials: "GW",
    sellerColor: "bg-[#B45309]",
    sellerName: "gerabah.wetan",
    timeAgo: "2 jam lalu",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    name: "Cangkir Keramik Kasongan Hand-thrown Glaze Terracotta 220ml",
    price: 38000,
    category: "Gerabah & Keramik Kasongan",
    condition: "Baru",
    location: "Bantul",
    likes: 11,
    description: "Cangkir keramik handmade dari sentra pengrajin Kasongan Bantul. Dilapisi glasir terracotta alami food grade yang aman untuk minuman panas maupun dingin.",
  },
  {
    id: "6",
    sellerInitials: "MH",
    sellerColor: "bg-[#78350F]",
    sellerName: "madu.hutan.sumbawa",
    timeAgo: "3 jam lalu",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    name: "Madu Hutan Liar Murni Asli Sumbawa Raw Honey 500 gram Panen Baru",
    price: 115000,
    category: "Herbal & Minyak Atsiri",
    condition: "Baru",
    location: "Sumbawa",
    likes: 32,
    description: "Madu liar murni dipanen dari sarang lebah raksasa Apis Dorsata di hutan primer Sumbawa. Alami tanpa proses pemanasan atau campuran gula.",
  },
  {
    id: "7",
    sellerInitials: "KJ",
    sellerColor: "bg-[#EA580C]",
    sellerName: "kayu.jati.kreatif",
    timeAgo: "4 jam lalu",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    name: "Talenan & Piring Kayu Jati Perhutani Tebal Finishing Beeswax Organik",
    price: 55000,
    category: "Peralatan Kayu Jati",
    condition: "Baru",
    location: "Jepara",
    likes: 17,
    description: "Talenan kayu jati solid asal Jepara dengan ketebalan 2.5cm. Dilapisi organic beeswax food grade, tahan gores pisau dan aman untuk penyajian makanan.",
  },
  {
    id: "8",
    sellerInitials: "BT",
    sellerColor: "bg-[#6D28D9]",
    sellerName: "batik.tulis.lasem",
    timeAgo: "5 jam lalu",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    imageTag: "Preloved Istimewa",
    name: "Selendang Sutra Batik Tulis Lasem Tiga Negeri Koleksi Pribadi Mulus",
    price: 45000,
    category: "Batik & Kain Tenun",
    condition: "Like new",
    location: "Rembang",
    likes: 42,
    description: "Batik tulis legendaris khas Lasem motif Tiga Negeri dengan canting halus. Koleksi pribadi terawat, tanpa noda, warna merah getih pitik masih sangat pekat.",
  },
  {
    id: "9",
    sellerInitials: "SB",
    sellerColor: "bg-[#047857]",
    sellerName: "sentra.borobudur",
    timeAgo: "6 jam lalu",
    badge: "Kurasi Sentra",
    badgeColor: "text-[#FF6801] border-[#FF6801]/30 bg-orange-50/50",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    imageTag: "Handmade",
    name: "Cobek Batu Kali Asli Lereng Merapi Pahat Halus Diameter 20cm",
    price: 75000,
    category: "Peralatan Kayu Jati",
    condition: "Baru",
    location: "Magelang",
    likes: 29,
    description: "Cobek batu kali hitam asli dipahat manual oleh pengrajin Muntilan lereng Merapi. Bebas pasir dan tidak luntur saat digunakan mengulek bumbu.",
  },
  {
    id: "10",
    sellerInitials: "PJ",
    sellerColor: "bg-[#4338CA]",
    sellerName: "pekalongan.jaya",
    timeAgo: "7 jam lalu",
    image: "https://images.unsplash.com/photo-1596464716127-f2a829822391?auto=format&fit=crop&w=800&q=80",
    name: "Kemeja Batik Cap Katun Primisima Motif Parang Tuding Pekalongan",
    price: 135000,
    category: "Batik & Kain Tenun",
    condition: "Baru",
    location: "Pekalongan",
    likes: 15,
    description: "Batik cap premium Pekalongan dengan bahan katun primisima dingin dan nyaman dipakai sehari-hari. Jahitan rapi berkancing tersembunyi.",
  },
  {
    id: "11",
    sellerInitials: "TR",
    sellerColor: "bg-[#B91C1C]",
    sellerName: "toraja.roastery",
    timeAgo: "8 jam lalu",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    name: "Kopi Arabika Toraja Sapan Specialty Grade 1 Biji Sangrai 200gr",
    price: 90000,
    category: "Biji Kopi Lokal & Rempah",
    condition: "Baru",
    location: "Tana Toraja",
    likes: 21,
    description: "Ditanam pada ketinggian 1800-2100 mdpl di dataran tinggi Toraja Sapan. Menghasilkan karakter rasa rempah herba, citrus segar, dan aftertaste manis madu.",
  },
  {
    id: "12",
    sellerInitials: "KR",
    sellerColor: "bg-[#0F766E]",
    sellerName: "kriya.rotan.cirebon",
    timeAgo: "9 jam lalu",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80",
    imageTag: "Handmade",
    name: "Keranjang Serbaguna Rotan Alami Anyaman Rapi Estetik",
    price: 48000,
    category: "Anyaman & Kerajinan Rotan",
    condition: "Baru",
    location: "Cirebon",
    likes: 33,
    description: "Keranjang multifungsi berbahan rotan alam lokal Cirebon dengan finishing ramah lingkungan, cocok sebagai wadah bumbu atau dekorasi ruangan minimalis.",
  },
];

const CATEGORY_TABS = [
  "Semua Produk UMKM",
  "Batik & Kain Tenun",
  "Anyaman & Kerajinan Rotan",
  "Herbal & Minyak Atsiri",
  "Biji Kopi Lokal & Rempah",
  "Gerabah & Keramik Kasongan",
  "Peralatan Kayu Jati",
];

const POPULAR_SEARCHES = [
  "kain lurik jogja",
  "tas purun borneo",
  "biji kopi gayo",
  "sabun sereh herbal",
  "batik cap pekalongan",
  "anyaman pandan",
  "kerajinan tembaga boyolali",
  "gula aren semut organik",
  "minyak kayu putih ambon",
  "tenun troso jepara",
  "cobek batu kali asli",
  "kopi toraja kalosi",
  "sambal roa manado",
];

const LOCATIONS = [
  "Semua Lokasi",
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
];

export default function Home() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [activeTab, setActiveTab] = useState("Semua Produk UMKM");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Indonesia");
  const [sortBy, setSortBy] = useState<"relevant" | "price-low" | "price-high" | "likes">("relevant");
  const [conditionFilter, setConditionFilter] = useState<"all" | "Baru" | "Like new">("all");
  const [priceRange, setPriceRange] = useState<"all" | "under50" | "50to150" | "above150">("all");
  const [saveFilter, setSaveFilter] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(8);

  // Dropdown open states for desktop/mobile filter bar
  const [openFilterMenu, setOpenFilterMenu] = useState<"sort" | "condition" | "price" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        setAuthUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
  }, []);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Form for Sell Item Modal
  const [sellForm, setSellForm] = useState({
    name: "",
    price: "",
    category: "Batik & Kain Tenun",
    sellerName: "",
    location: "Yogyakarta",
    condition: "Baru",
    description: "",
    imageTag: "Handmade",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch from backend Go API only if NEXT_PUBLIC_API_URL is configured
  useEffect(() => {
    if (!apiUrl) return;

    let isMounted = true;
    async function loadBackendData() {
      try {
        const res = await window.fetch(`${apiUrl}/products`).catch(() => null);
        if (res && res.ok && isMounted) {
          const data = await res.json().catch(() => null);
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch {
        // Fallback default products already loaded
      }
    }

    loadBackendData();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => {
      const willBeLiked = !prev[id];
      if (willBeLiked) {
        showToast("Ditambahkan ke daftar favorit ❤️");
      }
      return { ...prev, [id]: willBeLiked };
    });
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.name || !sellForm.price || !sellForm.sellerName) {
      alert("Mohon lengkapi Nama Barang, Harga, dan Nama Toko.");
      return;
    }

    const priceNum = parseInt(sellForm.price.replace(/\D/g, ""), 10) || 0;
    const parts = sellForm.sellerName.split(".");
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : sellForm.sellerName.slice(0, 2).toUpperCase();

    const newProd: ProductItem = {
      id: String(Date.now()),
      sellerInitials: initials,
      sellerColor: "bg-[#FF6801]",
      sellerName: sellForm.sellerName.toLowerCase().replace(/\s+/g, "."),
      timeAgo: "Baru saja",
      badge: "Asli Pengrajin",
      badgeColor: "text-[#D97706] border-[#D97706]/30 bg-amber-50/50",
      image: sellForm.image,
      imageTag: sellForm.imageTag,
      name: sellForm.name,
      price: priceNum,
      category: sellForm.category,
      condition: sellForm.condition,
      location: sellForm.location,
      likes: 1,
      description: sellForm.description || "Produk lokal UMKM berkualitas tinggi.",
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsSellModalOpen(false);
    showToast("Listing baru berhasil dipublikasikan! 🎉");
    setSellForm({
      name: "",
      price: "",
      category: "Batik & Kain Tenun",
      sellerName: "",
      location: "Yogyakarta",
      condition: "Baru",
      description: "",
      imageTag: "Handmade",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
    });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (activeTab !== "Semua Produk UMKM") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Location Filter
    if (selectedLocation !== "Indonesia" && selectedLocation !== "Semua Lokasi") {
      result = result.filter(
        (p) => p.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    // Condition Filter
    if (conditionFilter !== "all") {
      result = result.filter(
        (p) => p.condition.toLowerCase() === conditionFilter.toLowerCase()
      );
    }

    // Price Filter
    if (priceRange === "under50") {
      result = result.filter((p) => p.price < 50000);
    } else if (priceRange === "50to150") {
      result = result.filter((p) => p.price >= 50000 && p.price <= 150000);
    } else if (priceRange === "above150") {
      result = result.filter((p) => p.price > 150000);
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "likes") {
      result.sort((a, b) => {
        const likesA = (likedMap[a.id] ? a.likes + 1 : a.likes);
        const likesB = (likedMap[b.id] ? b.likes + 1 : b.likes);
        return likesB - likesA;
      });
    }

    return result;
  }, [products, activeTab, searchQuery, selectedLocation, conditionFilter, priceRange, sortBy, likedMap]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col font-sans select-none sm:select-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-lg shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#FF6801]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER (Vibrant Orange Sentra Bar) */}
      <header className="bg-[#FF6801] text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Category Button */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div
              onClick={() => {
                setActiveTab("Semua Produk UMKM");
                setSearchQuery("");
                setSelectedLocation("Indonesia");
                setConditionFilter("all");
                setPriceRange("all");
                setSortBy("relevant");
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF6801] font-black text-xl shadow-sm">
                S
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                sentra
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-white/95 hover:text-white px-2 py-1 transition-opacity cursor-pointer"
              >
                <span>Semua Kategori</span>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 text-gray-800 text-xs border border-gray-100">
                  {CATEGORY_TABS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveTab(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-[#FF6801] font-medium transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center bg-white rounded-md shadow-sm h-10">
              <span className="pl-3.5 pr-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kain tenun, madu hutan, kriya anyaman..."
                className="w-full h-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none pr-3"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 px-2 text-xs"
                >
                  ✕
                </button>
              )}

              {/* Location selector dropdown */}
              <div className="relative hidden md:block h-full">
                <button
                  type="button"
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="flex items-center border-l border-gray-200 px-3 text-xs text-gray-600 gap-1 shrink-0 hover:bg-gray-50 h-full"
                >
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="max-w-[80px] truncate">{selectedLocation}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isLocationDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl py-2 z-50 text-gray-800 text-xs border border-gray-100 max-h-56 overflow-y-auto">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#FF6801] font-medium"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="bg-[#1A1A1A] hover:bg-black text-white px-5 sm:px-6 h-full text-xs sm:text-sm font-semibold transition-colors shrink-0 rounded-r-md"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Right Menu & CTA */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {authUser ? (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full text-xs font-semibold transition"
              >
                <span>👤 {authUser.name}</span>
                <span className="uppercase text-[10px] bg-white text-[#FF6801] px-1.5 py-0.5 rounded font-black">
                  {authUser.role}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="hidden sm:inline text-xs sm:text-sm font-medium text-white hover:underline cursor-pointer"
                >
                  Daftar
                </Link>
                <Link
                  href="/auth/login"
                  className="hidden sm:inline text-xs sm:text-sm font-medium text-white hover:underline cursor-pointer"
                >
                  Masuk
                </Link>
              </>
            )}
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="flex items-center gap-1 bg-white hover:bg-gray-50 text-[#FF6801] px-3.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              <span>+</span>
              <span>+ Jual</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. BREADCRUMB */}
      <div className="border-b border-gray-100 bg-[#FAFAFA]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-2.5 text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              setActiveTab("Semua Produk UMKM");
              setSearchQuery("");
            }}
            className="hover:text-gray-900 transition-colors"
          >
            Beranda
          </button>
          <span>›</span>
          <button
            onClick={() => setActiveTab("Semua Produk UMKM")}
            className="hover:text-gray-900 transition-colors"
          >
            Sentra UMKM Lokal
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">{activeTab === "Semua Produk UMKM" ? "Kriya, Tradisi & Kerajinan" : activeTab}</span>
        </div>
      </div>

      {/* 3. CATEGORY PILL TABS */}
      <div className="border-b border-gray-100 bg-white sticky top-14 sm:top-16 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {CATEGORY_TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setVisibleCount(8);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-[#FF6801] text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. FILTER CONTROLS BAR */}
      <div className="border-b border-gray-100 bg-white sticky top-[105px] sm:top-[117px] z-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Custom Dropdown Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Sort Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenFilterMenu(openFilterMenu === "sort" ? null : "sort")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                  sortBy !== "relevant"
                    ? "border-[#FF6801] bg-orange-50/50 text-[#FF6801] font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-800 bg-white"
                }`}
              >
                <span>
                  Urutan:{" "}
                  <strong className={sortBy !== "relevant" ? "text-[#FF6801]" : "text-gray-900"}>
                    {sortBy === "relevant"
                      ? "Paling Sesuai"
                      : sortBy === "price-low"
                      ? "Harga Terendah"
                      : sortBy === "price-high"
                      ? "Harga Tertinggi"
                      : "Paling Disukai"}
                  </strong>
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${openFilterMenu === "sort" ? "rotate-180 text-[#FF6801]" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {openFilterMenu === "sort" && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpenFilterMenu(null)} />
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Urutkan Hasil
                    </div>
                    {[
                      { id: "relevant", label: "Paling Sesuai" },
                      { id: "price-low", label: "Harga: Terendah ke Tertinggi" },
                      { id: "price-high", label: "Harga: Tertinggi ke Terendah" },
                      { id: "likes", label: "Paling Banyak Disukai" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSortBy(item.id as any);
                          setOpenFilterMenu(null);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-orange-50 hover:text-[#FF6801] transition-colors ${
                          sortBy === item.id ? "text-[#FF6801] font-bold bg-orange-50/50" : "text-gray-700"
                        }`}
                      >
                        <span>{item.label}</span>
                        {sortBy === item.id && <span className="text-[#FF6801] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Condition Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenFilterMenu(openFilterMenu === "condition" ? null : "condition")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                  conditionFilter !== "all"
                    ? "border-[#FF6801] bg-orange-50/50 text-[#FF6801] font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-800 bg-white"
                }`}
              >
                <span>
                  Kondisi:{" "}
                  <strong className={conditionFilter !== "all" ? "text-[#FF6801]" : "text-gray-900"}>
                    {conditionFilter === "all" ? "Semua" : conditionFilter}
                  </strong>
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${openFilterMenu === "condition" ? "rotate-180 text-[#FF6801]" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {openFilterMenu === "condition" && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpenFilterMenu(null)} />
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Pilih Kondisi
                    </div>
                    {[
                      { id: "all", label: "Semua Kondisi" },
                      { id: "Baru", label: "Baru" },
                      { id: "Like new", label: "Preloved Istimewa / Like new" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setConditionFilter(item.id as any);
                          setOpenFilterMenu(null);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-orange-50 hover:text-[#FF6801] transition-colors ${
                          conditionFilter === item.id ? "text-[#FF6801] font-bold bg-orange-50/50" : "text-gray-700"
                        }`}
                      >
                        <span>{item.label}</span>
                        {conditionFilter === item.id && <span className="text-[#FF6801] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Price Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenFilterMenu(openFilterMenu === "price" ? null : "price")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                  priceRange !== "all"
                    ? "border-[#FF6801] bg-orange-50/50 text-[#FF6801] font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-800 bg-white"
                }`}
              >
                <span>
                  Harga:{" "}
                  <strong className={priceRange !== "all" ? "text-[#FF6801]" : "text-gray-900"}>
                    {priceRange === "all"
                      ? "Semua"
                      : priceRange === "under50"
                      ? "< Rp 50rb"
                      : priceRange === "50to150"
                      ? "Rp 50rb - 150rb"
                      : "> Rp 150rb"}
                  </strong>
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${openFilterMenu === "price" ? "rotate-180 text-[#FF6801]" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {openFilterMenu === "price" && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpenFilterMenu(null)} />
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Rentang Harga
                    </div>
                    {[
                      { id: "all", label: "Semua Harga" },
                      { id: "under50", label: "Di bawah Rp 50.000" },
                      { id: "50to150", label: "Rp 50.000 - Rp 150.000" },
                      { id: "above150", label: "Di atas Rp 150.000" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setPriceRange(item.id as any);
                          setOpenFilterMenu(null);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-orange-50 hover:text-[#FF6801] transition-colors ${
                          priceRange === item.id ? "text-[#FF6801] font-bold bg-orange-50/50" : "text-gray-700"
                        }`}
                      >
                        <span>{item.label}</span>
                        {priceRange === item.id && <span className="text-[#FF6801] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filter Lainnya (Drawer trigger) */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-medium bg-white cursor-pointer transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              <span>Filter Lainnya</span>
            </button>

            {/* Clear / Reset Filter Button */}
            {(conditionFilter !== "all" || priceRange !== "all" || sortBy !== "relevant" || selectedLocation !== "Indonesia") && (
              <button
                onClick={() => {
                  setConditionFilter("all");
                  setPriceRange("all");
                  setSortBy("relevant");
                  setSelectedLocation("Indonesia");
                  showToast("Semua filter telah dibersihkan");
                }}
                className="flex items-center gap-1 text-xs text-[#FF6801] font-semibold bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <span>✕</span>
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          {/* Right: Simpan Filter Toggle Switch */}
          <div className="flex items-center gap-2.5 text-xs text-gray-500 pl-2">
            <span className="hidden sm:inline text-gray-400">Menyimpan pencarian ini?</span>
            <span className="text-gray-800 font-medium">Simpan filter</span>
            <button
              onClick={() => {
                setSaveFilter(!saveFilter);
                showToast(!saveFilter ? "Preferensi filter berhasil disimpan!" : "Penyimpanan filter dinonaktifkan");
              }}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                saveFilter ? "bg-[#FF6801]" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  saveFilter ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 5. MAIN CONTENT & 4-COLUMN PRODUCT GRID */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Results Count Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {filteredProducts.length > 0 ? (
              <>48.250+ barang kriya & produk UMKM di Indonesia</>
            ) : (
              <>Produk Tidak Ditemukan</>
            )}
          </h1>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Menampilkan 1-{Math.min(displayedProducts.length, filteredProducts.length)} dari {filteredProducts.length} hasil
          </span>
        </div>

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-7">
            {displayedProducts.map((p) => {
              const isLiked = likedMap[p.id];
              const currentLikes = isLiked ? p.likes + 1 : p.likes;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="flex flex-col group cursor-pointer"
                >
                  {/* Seller Top Bar */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full ${p.sellerColor} text-white flex items-center justify-center text-[10px] font-bold`}
                      >
                        {p.sellerInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-900 leading-tight">
                          {p.sellerName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {p.timeAgo}
                        </span>
                      </div>
                    </div>

                    {p.badge && (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                          p.badgeColor || "text-gray-600 border-gray-200"
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>

                  {/* Square Product Image */}
                  <div className="relative aspect-square w-full rounded-md overflow-hidden bg-gray-100 mb-2.5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    {p.imageTag && (
                      <span className="absolute bottom-2.5 left-2.5 bg-black/75 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                        {p.imageTag}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-[13px] text-gray-900 leading-[18px] line-clamp-2 min-h-[36px] hover:text-[#FF6801] transition-colors">
                    {p.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-1 text-sm sm:text-base font-bold text-gray-900">
                    Rp {p.price.toLocaleString("id-ID")}
                  </div>

                  {/* Condition, Location & Likes Footer */}
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
                    <div className="truncate">
                      <span>{p.condition}</span>
                      <span className="mx-1">•</span>
                      <span>{p.location}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(p.id);
                      }}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors shrink-0 pl-2 cursor-pointer"
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-colors ${
                          isLiked ? "fill-red-500 text-red-500" : "fill-gray-400 text-gray-400"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                      <span>{currentLikes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-gray-50 rounded-xl p-8 border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-gray-800">
              Tidak ada produk yang cocok dengan kriteria pencarian
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Cobalah mereset filter harga, kondisi, atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setActiveTab("Semua Produk UMKM");
                setSearchQuery("");
                setConditionFilter("all");
                setPriceRange("all");
                setSelectedLocation("Indonesia");
              }}
              className="mt-4 px-4 py-2 bg-[#FF6801] text-white text-xs font-semibold rounded hover:bg-[#E55D00] transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

        {/* Load More Button */}
        {displayedProducts.length < filteredProducts.length && (
          <div className="pt-6 pb-4 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="bg-[#FF6801] hover:bg-[#E55D00] text-white px-8 py-3 rounded text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              Tampilkan lebih banyak produk ({filteredProducts.length - displayedProducts.length} lagi)
            </button>
          </div>
        )}
      </main>

      {/* 6. POPULAR KEYWORDS FOOTER SECTION */}
      <section className="bg-[#F8F9FA] border-t border-gray-200 py-6 text-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <p className="font-bold text-[#FF6801] mb-2">
            Pencarian Populer di Pasar Sentra UMKM:
          </p>
          <p className="text-gray-600 leading-relaxed">
            {POPULAR_SEARCHES.map((term, index) => (
              <span key={term}>
                <button
                  onClick={() => {
                    setSearchQuery(term);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gray-900 transition-colors text-left"
                >
                  {term}
                </button>
                {index < POPULAR_SEARCHES.length - 1 && (
                  <span className="mx-2 text-gray-400">•</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* 7. BOTTOM FOOTER BAR */}
      <footer className="bg-[#FF6801] text-white text-xs py-4">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#FF6801] font-bold text-xs">
              S
            </div>
            <span>© 2025 Sentra UMKM Indonesia. Menghubungkan pengrajin & pembeli langsung.</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-white/90">
            <button onClick={() => showToast("Pusat Bantuan Sentra: cs@sentra.id")} className="hover:text-white hover:underline transition-colors">
              Bantuan
            </button>
            <button onClick={() => showToast("Panduan Komunitas Pengrajin Nusantara")} className="hover:text-white hover:underline transition-colors">
              Panduan Komunitas
            </button>
            <button onClick={() => setIsSellModalOpen(true)} className="hover:text-white hover:underline transition-colors">
              Tips Jual Cepat
            </button>
            <button onClick={() => showToast("Kebijakan Privasi Sentra 100% terlindungi")} className="hover:text-white hover:underline transition-colors">
              Kebijakan Privasi
            </button>
            <button onClick={() => showToast("Syarat & Ketentuan berlaku untuk transaksi aman")} className="hover:text-white hover:underline transition-colors">
              Syarat & Ketentuan
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL: DETAIL PRODUK */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full ${selectedProduct.sellerColor} text-white flex items-center justify-center text-xs font-bold`}
                >
                  {selectedProduct.sellerInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{selectedProduct.sellerName}</h4>
                  <p className="text-[10px] text-gray-500">{selectedProduct.location} • {selectedProduct.timeAgo}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Gambar Modal */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              {selectedProduct.imageTag && (
                <span className="absolute bottom-2.5 left-2.5 bg-black/75 text-white text-xs font-medium px-2 py-0.5 rounded">
                  {selectedProduct.imageTag}
                </span>
              )}
            </div>

            {/* Info Produk */}
            <div>
              <span className="text-xs text-[#FF6801] font-bold block mb-1">
                {selectedProduct.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {selectedProduct.name}
              </h2>
              <div className="text-xl font-extrabold text-gray-900 mt-2">
                Rp {selectedProduct.price.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                {selectedProduct.description || "Produk lokal kerajinan kriya asli Nusantara berdaya saing tinggi."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => toggleLike(selectedProduct.id)}
                className="px-4 py-2.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <svg
                  className={`w-4 h-4 ${
                    likedMap[selectedProduct.id] ? "fill-red-500 text-red-500" : "fill-gray-400 text-gray-400"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <span>{likedMap[selectedProduct.id] ? "Disukai" : "Sukai"}</span>
              </button>

              <button
                onClick={() => {
                  showToast(`Menghubungkan ke toko ${selectedProduct.sellerName}...`);
                  setSelectedProduct(null);
                }}
                className="flex-1 bg-[#FF6801] hover:bg-[#E55D00] text-white py-2.5 rounded text-xs font-bold text-center transition-colors shadow-sm"
              >
                Hubungi Pengrajin / Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PASANG LISTING BARU (+ Jual) */}
      {isSellModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsSellModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900">+ Pasang Iklan Produk UMKM</h3>
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSellSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Nama Produk / Barang</label>
                <input
                  type="text"
                  required
                  value={sellForm.name}
                  onChange={(e) => setSellForm({ ...sellForm, name: e.target.value })}
                  placeholder="Contoh: Tas Anyaman Pandan Asli Kebumen"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-[#FF6801]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    value={sellForm.price}
                    onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                    placeholder="Contoh: 65000"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-[#FF6801]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Kategori</label>
                  <select
                    value={sellForm.category}
                    onChange={(e) => setSellForm({ ...sellForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-[#FF6801] bg-white"
                  >
                    {CATEGORY_TABS.filter((c) => c !== "Semua Produk UMKM").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nama Toko / Pengrajin</label>
                  <input
                    type="text"
                    required
                    value={sellForm.sellerName}
                    onChange={(e) => setSellForm({ ...sellForm, sellerName: e.target.value })}
                    placeholder="Contoh: kriya.pandan.asli"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-[#FF6801]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Kota Asal</label>
                  <input
                    type="text"
                    required
                    value={sellForm.location}
                    onChange={(e) => setSellForm({ ...sellForm, location: e.target.value })}
                    placeholder="Contoh: Kebumen"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-[#FF6801]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Kondisi</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      checked={sellForm.condition === "Baru"}
                      onChange={() => setSellForm({ ...sellForm, condition: "Baru" })}
                      className="text-[#FF6801]"
                    />
                    <span>Baru</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      checked={sellForm.condition === "Like new"}
                      onChange={() => setSellForm({ ...sellForm, condition: "Like new" })}
                      className="text-[#FF6801]"
                    />
                    <span>Preloved Istimewa / Like new</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={sellForm.description}
                  onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                  placeholder="Ceritakan proses pembuatan, keunggulan bahan, dan detail ukuran..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-[#FF6801]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSellModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-[#FF6801] hover:bg-[#E55D00] text-white font-bold transition-colors shadow-sm"
                >
                  Tayangkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DAFTAR / MASUK */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#FF6801] text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-sm">
              S
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Masuk ke Sentra UMKM</h3>
              <p className="text-xs text-gray-500 mt-1">
                Akses ratusan ribu produk kriya dan karya pengrajin terverifikasi di seluruh Nusantara.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <Link
                href="/auth"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full py-2.5 px-4 bg-[#FF6801] hover:bg-[#E55D00] text-white rounded font-bold transition-colors block text-center shadow-sm"
              >
                🔐 Masuk / Daftar Akun (Testing Backend API)
              </Link>
              <button
                onClick={() => {
                  showToast("Berhasil masuk sebagai Pengguna Tamu");
                  setIsLoginModalOpen(false);
                }}
                className="w-full py-2.5 px-4 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <span>Lanjut dengan Akun Google (Demo)</span>
              </button>
              <button
                onClick={() => {
                  showToast("Berhasil masuk melalui WhatsApp");
                  setIsLoginModalOpen(false);
                }}
                className="w-full py-2.5 px-4 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Masuk dengan Nomor WhatsApp (Demo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: FILTER LAINNYA */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Filter Tambahan</h3>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Kategori Filter */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">Kategori</label>
                <div className="space-y-1.5 text-xs text-gray-600">
                  {CATEGORY_TABS.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="drawerCat"
                        checked={activeTab === cat}
                        onChange={() => setActiveTab(cat)}
                        className="text-[#FF6801]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lokasi Filter */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">Wilayah / Kota</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Rentang Harga */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">Rentang Harga</label>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="drawerPrice"
                      checked={priceRange === "all"}
                      onChange={() => setPriceRange("all")}
                    />
                    <span>Semua Harga</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="drawerPrice"
                      checked={priceRange === "under50"}
                      onChange={() => setPriceRange("under50")}
                    />
                    <span>Di bawah Rp 50.000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="drawerPrice"
                      checked={priceRange === "50to150"}
                      onChange={() => setPriceRange("50to150")}
                    />
                    <span>Rp 50.000 - Rp 150.000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="drawerPrice"
                      checked={priceRange === "above150"}
                      onChange={() => setPriceRange("above150")}
                    />
                    <span>Di atas Rp 150.000</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  setActiveTab("Semua Produk UMKM");
                  setSelectedLocation("Indonesia");
                  setPriceRange("all");
                  setConditionFilter("all");
                  setIsFilterDrawerOpen(false);
                }}
                className="flex-1 py-2.5 border border-gray-300 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2.5 bg-[#FF6801] hover:bg-[#E55D00] text-white rounded text-xs font-bold transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
