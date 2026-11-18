"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/api";
import SellProductModal from "@/components/sell/SellProductModal";

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

type SortBy = "relevant" | "price-low" | "price-high" | "likes";
type ConditionFilter = "all" | "Baru" | "Like new";
type PriceRange = "all" | "under50" | "50to150" | "above150";

const SORT_OPTIONS: { id: SortBy; label: string }[] = [
  { id: "relevant", label: "Paling Sesuai" },
  { id: "price-low", label: "Harga: Terendah ke Tertinggi" },
  { id: "price-high", label: "Harga: Tertinggi ke Terendah" },
  { id: "likes", label: "Paling Banyak Disukai" },
];

const CONDITION_OPTIONS: { id: ConditionFilter; label: string }[] = [
  { id: "all", label: "Semua Kondisi" },
  { id: "Baru", label: "Baru" },
  { id: "Like new", label: "Preloved Istimewa / Like new" },
];

const PRICE_OPTIONS: { id: PriceRange; label: string }[] = [
  { id: "all", label: "Semua Harga" },
  { id: "under50", label: "Di bawah Rp 50.000" },
  { id: "50to150", label: "Rp 50.000 - Rp 150.000" },
  { id: "above150", label: "Di atas Rp 150.000" },
];

type FilterValues = {
  selectedLocation: string;
  conditionFilter: ConditionFilter;
  priceRange: PriceRange;
  showOnlyLiked: boolean;
};

const DEFAULT_FILTERS: FilterValues = {
  selectedLocation: "Semua Lokasi",
  conditionFilter: "all",
  priceRange: "all",
  showOnlyLiked: false,
};

const SORT_LABELS: Record<SortBy, string> = {
  relevant: "Paling Sesuai",
  "price-low": "Harga Terendah",
  "price-high": "Harga Tertinggi",
  likes: "Paling Disukai",
};

const PRICE_CHIP_LABELS: Record<Exclude<PriceRange, "all">, string> = {
  under50: "< Rp 50rb",
  "50to150": "Rp 50rb - 150rb",
  above150: "> Rp 150rb",
};

function filterProducts(
  products: ProductItem[],
  context: FilterValues & {
    activeTab: string;
    searchQuery: string;
    sortBy: SortBy;
    likedMap: Record<string, boolean>;
  }
): ProductItem[] {
  let result = [...products];

  if (context.activeTab !== "Semua Produk UMKM") {
    result = result.filter(
      (p) => p.category.toLowerCase() === context.activeTab.toLowerCase()
    );
  }

  if (context.searchQuery.trim()) {
    const q = context.searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (context.selectedLocation !== "Semua Lokasi") {
    result = result.filter(
      (p) => p.location.toLowerCase() === context.selectedLocation.toLowerCase()
    );
  }

  if (context.showOnlyLiked) {
    result = result.filter((p) => context.likedMap[p.id]);
  }

  if (context.conditionFilter !== "all") {
    result = result.filter(
      (p) => p.condition.toLowerCase() === context.conditionFilter.toLowerCase()
    );
  }

  if (context.priceRange === "under50") {
    result = result.filter((p) => p.price < 50000);
  } else if (context.priceRange === "50to150") {
    result = result.filter((p) => p.price >= 50000 && p.price <= 150000);
  } else if (context.priceRange === "above150") {
    result = result.filter((p) => p.price > 150000);
  }

  if (context.sortBy === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (context.sortBy === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (context.sortBy === "likes") {
    result.sort((a, b) => {
      const likesA = context.likedMap[a.id] ? a.likes + 1 : a.likes;
      const likesB = context.likedMap[b.id] ? b.likes + 1 : b.likes;
      return likesB - likesA;
    });
  }

  return result;
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#FF6801]/30 bg-[#FFF4E8] py-1 pl-2.5 pr-1 text-[11px] font-semibold text-[#C24E00]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Hapus filter ${label}`}
        className="grid h-5 w-5 place-items-center rounded-full transition-colors hover:bg-[#FF6801]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40"
      >
        <svg
          className="h-2.5 w-2.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </span>
  );
}


function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Home() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [activeTab, setActiveTab] = useState("Semua Produk UMKM");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Semua Lokasi");
  const [sortBy, setSortBy] = useState<SortBy>("relevant");
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuthUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
  }, []);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [showOnlyLiked, setShowOnlyLiked] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const locationMenuRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const conditionButtonRef = useRef<HTMLButtonElement>(null);
  const conditionMenuRef = useRef<HTMLDivElement>(null);
  const priceButtonRef = useRef<HTMLButtonElement>(null);
  const priceMenuRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterSheetRef = useRef<HTMLDivElement>(null);
  const filterSheetCloseRef = useRef<HTMLButtonElement>(null);

  // Fokuskan item lokasi aktif saat dropdown dibuka.
  useEffect(() => {
    if (!isLocationDropdownOpen) return;
    const active =
      locationMenuRef.current?.querySelector<HTMLButtonElement>(
        '[role="menuitemradio"][aria-checked="true"]'
      ) ??
      locationMenuRef.current?.querySelector<HTMLButtonElement>(
        '[role="menuitemradio"]'
      );
    active?.focus();
  }, [isLocationDropdownOpen]);

  // Tutup semua dropdown/panel header saat klik di luar atau tekan Escape.
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
        setIsMobileNavOpen(false);
        setIsAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocationDropdownOpen(false);
        setIsMobileNavOpen(false);
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const scrollToProducts = () => {
    document
      .getElementById("daftar-produk")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const likedCount = useMemo(
    () => Object.values(likedMap).filter(Boolean).length,
    [likedMap]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (conditionFilter !== "all") count += 1;
    if (priceRange !== "all") count += 1;
    if (selectedLocation !== "Semua Lokasi") count += 1;
    if (showOnlyLiked) count += 1;
    return count;
  }, [conditionFilter, priceRange, selectedLocation, showOnlyLiked]);

  const clearAllFilters = () => {
    setConditionFilter("all");
    setPriceRange("all");
    setSelectedLocation("Semua Lokasi");
    setShowOnlyLiked(false);
  };

  const openFilterSheet = () => {
    setOpenFilterMenu(null);
    setDraftFilters({
      selectedLocation,
      conditionFilter,
      priceRange,
      showOnlyLiked,
    });
    setIsFilterDrawerOpen(true);
  };

  const closeFilterSheet = useCallback(() => {
    setIsFilterDrawerOpen(false);
    filterTriggerRef.current?.focus();
  }, []);

  const applyDraftFilters = () => {
    setSelectedLocation(draftFilters.selectedLocation);
    setConditionFilter(draftFilters.conditionFilter);
    setPriceRange(draftFilters.priceRange);
    setShowOnlyLiked(draftFilters.showOnlyLiked);
    setVisibleCount(8);
    closeFilterSheet();
    scrollToProducts();
  };

  const resetToAllProducts = () => {
    setActiveTab("Semua Produk UMKM");
    setSearchQuery("");
    setSelectedLocation("Semua Lokasi");
    setConditionFilter("all");
    setPriceRange("all");
    setSortBy("relevant");
    setShowOnlyLiked(false);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLocationDropdownOpen(false);
    setIsMobileNavOpen(false);
    setIsAccountMenuOpen(false);
    scrollToProducts();
  };

  const toggleFavorites = () => {
    setIsMobileNavOpen(false);
    setIsAccountMenuOpen(false);
    if (!showOnlyLiked && likedCount === 0) {
      showToast("Belum ada produk favorit.");
      return;
    }
    setShowOnlyLiked((value) => !value);
    scrollToProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_store");
    setAuthUser(null);
    setIsAccountMenuOpen(false);
    showToast("Berhasil keluar dari akun.");
  };

  const handleLocationMenuKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setIsLocationDropdownOpen(false);
      locationButtonRef.current?.focus();
      return;
    }

    const items = Array.from(
      locationMenuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]'
      ) ?? []
    );
    if (items.length === 0) return;

    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (event.key === "Tab") {
      setIsLocationDropdownOpen(false);
    }
  };

  const handleFilterMenuKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    triggerRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpenFilterMenu(null);
      triggerRef.current?.focus();
      return;
    }

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]'
      )
    );
    if (items.length === 0) return;

    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (event.key === "Tab") {
      setOpenFilterMenu(null);
    }
  };

  // Fokuskan opsi aktif saat dropdown filter dibuka.
  useEffect(() => {
    if (!openFilterMenu) return;
    const menu =
      openFilterMenu === "sort"
        ? sortMenuRef.current
        : openFilterMenu === "condition"
        ? conditionMenuRef.current
        : priceMenuRef.current;
    if (!menu) return;
    const active =
      menu.querySelector<HTMLButtonElement>(
        '[role="menuitemradio"][aria-checked="true"]'
      ) ?? menu.querySelector<HTMLButtonElement>('[role="menuitemradio"]');
    active?.focus();
  }, [openFilterMenu]);

  // Kunci scroll, tangkap fokus, dan tutup panel filter dengan Escape.
  useEffect(() => {
    if (!isFilterDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      filterSheetCloseRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFilterSheet();
        return;
      }
      if (event.key !== "Tab" || !filterSheetRef.current) return;

      const focusables = Array.from(
        filterSheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterDrawerOpen, closeFilterSheet]);

  // Sell Item Modal State & Handlers
  const [newProductId, setNewProductId] = useState<string | null>(null);

  const openSellModal = () => {
    setIsSellModalOpen(true);
  };

  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
    setVisibleCount(8);
    setNewProductId(newProd.id);
    showToast("Produk berhasil dipasang.");
    window.setTimeout(() => scrollToProducts(), 80);
    window.setTimeout(() => setNewProductId(null), 6000);
  };

  const apiUrl = getApiBaseUrl();

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
        showToast("Ditambahkan ke daftar favorit");
      }
      return { ...prev, [id]: willBeLiked };
    });
  };


  // Filter & Sort Logic
  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        activeTab,
        searchQuery,
        selectedLocation,
        conditionFilter,
        priceRange,
        sortBy,
        likedMap,
        showOnlyLiked,
      }),
    [
      products,
      activeTab,
      searchQuery,
      selectedLocation,
      conditionFilter,
      priceRange,
      sortBy,
      likedMap,
      showOnlyLiked,
    ]
  );

  const draftResultCount = useMemo(() => {
    if (!isFilterDrawerOpen) return filteredProducts.length;
    return filterProducts(products, {
      activeTab,
      searchQuery,
      ...draftFilters,
      sortBy,
      likedMap,
    }).length;
  }, [
    isFilterDrawerOpen,
    filteredProducts.length,
    products,
    activeTab,
    searchQuery,
    draftFilters,
    sortBy,
    likedMap,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-lg shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#FF6801]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER (Vibrant Orange Sentra Bar) */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-[#FF6801] text-white shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_30px_-22px_rgba(0,0,0,0.55)]"
      >
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-2 gap-y-2 px-4 pb-3 pt-2 sm:h-16 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0"
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={resetToAllProducts}
            aria-label="SentraUMKM — beranda"
            className="group order-1 flex shrink-0 items-center gap-2 rounded-xl pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[0.7rem] bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-px sm:h-10 sm:w-10 sm:rounded-[0.8rem]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/[0.05] to-transparent"
              />
              <span className="relative text-[1.05rem] font-black leading-none tracking-[-0.04em] text-[#FF6801] sm:text-[1.15rem]">
                S
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[1.05rem] font-extrabold leading-none tracking-[-0.03em] text-white sm:text-[1.1rem]">
                Sentra
                <span className="hidden text-white/75 sm:inline">UMKM</span>
              </span>
              <span className="mt-1 hidden text-[7.5px] font-bold uppercase leading-none tracking-[0.2em] text-white/60 sm:block">
                Pasar UMKM Indonesia
              </span>
            </span>
          </Link>

          {/* Search */}
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="order-3 w-full min-w-0 sm:order-2 sm:w-auto sm:flex-1"
          >
          <div className="relative flex h-11 min-w-0 items-center rounded-full bg-white pl-3 pr-1 shadow-[0_2px_10px_-6px_rgba(0,0,0,0.45)] transition-shadow focus-within:ring-2 focus-within:ring-white/70 focus-within:ring-offset-2 focus-within:ring-offset-[#FF6801] sm:h-10">
            <svg
              className="h-4 w-4 shrink-0 text-[#9CA3AF]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <label htmlFor="nav-search" className="sr-only">
              Cari produk UMKM
            </label>
            <input
              id="nav-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kain tenun, madu hutan..."
              enterKeyHint="search"
              className="h-full w-full min-w-0 bg-transparent px-2.5 text-xs text-[#1E1E1E] outline-none placeholder:text-[#9CA3AF] sm:text-sm"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="mr-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#4B5563]"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            )}

            {/* Location selector dropdown */}
            <div className="relative hidden h-full md:block">
              <button
                ref={locationButtonRef}
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                aria-expanded={isLocationDropdownOpen}
                aria-haspopup="menu"
                aria-controls="nav-location-menu"
                className="flex h-full items-center gap-1 border-l border-[#E5E7EB] px-3 text-xs font-medium text-[#4B5563] transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6801]/40"
              >
                <svg
                  className="h-3.5 w-3.5 text-[#9CA3AF]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span className="max-w-[80px] truncate">{selectedLocation}</span>
                <svg
                  className={`h-3 w-3 text-[#9CA3AF] transition-transform ${
                    isLocationDropdownOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isLocationDropdownOpen && (
                <div
                  id="nav-location-menu"
                  ref={locationMenuRef}
                  role="menu"
                  aria-label="Pilih lokasi"
                  onKeyDown={handleLocationMenuKeyDown}
                  className="absolute right-0 top-full z-50 mt-3 max-h-64 w-48 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white py-1.5 text-xs text-[#374151] shadow-xl"
                >
                  {LOCATIONS.map((loc) => {
                    const active = selectedLocation === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationDropdownOpen(false);
                          locationButtonRef.current?.focus();
                        }}
                        className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left font-medium transition-colors ${
                          active
                            ? "bg-[#FFF4E8] text-[#FF6801]"
                            : "hover:bg-[#FAFAFA] hover:text-[#FF6801]"
                        }`}
                      >
                        <span className="truncate">{loc}</span>
                        {active && (
                          <svg
                            className="h-3.5 w-3.5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              aria-label="Cari"
              className="relative mx-0.5 flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#FF6801] px-3 text-xs font-bold text-white transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-[#F25E00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40 sm:px-4"
            >
              <svg
                className="h-3.5 w-3.5 sm:hidden"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span className="hidden sm:inline">Cari</span>
            </button>
          </div>
          </form>

          {/* Right Menu & CTA */}
          <div className="order-2 ml-auto flex shrink-0 items-center gap-1 sm:order-3 sm:ml-0 sm:gap-1.5">
            {/* Favorit (desktop) */}
            <button
              type="button"
              onClick={toggleFavorites}
              aria-pressed={showOnlyLiked}
              aria-label={
                showOnlyLiked
                  ? "Tampilkan semua produk"
                  : "Tampilkan produk favorit"
              }
              className={`relative hidden h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors after:absolute after:-inset-0.5 after:content-[''] sm:flex ${
                showOnlyLiked
                  ? "bg-white text-[#FF6801]"
                  : "text-white/90 hover:bg-white/15"
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill={showOnlyLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.5s-7.5-4.4-7.5-9.9A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 3.2c0 5.5-7.5 9.9-7.5 9.9Z"
                />
              </svg>
              {likedCount > 0 && <span>{likedCount}</span>}
            </button>

            {authUser ? (
              <div className="relative">
                <button
                  ref={accountButtonRef}
                  type="button"
                  onClick={() => setIsAccountMenuOpen((value) => !value)}
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="menu"
                  aria-controls="nav-account-menu"
                  className="flex h-10 items-center gap-2 rounded-full bg-white/15 pl-1 pr-2.5 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[11px] font-black text-[#FF6801]">
                    {getInitials(authUser.name)}
                  </span>
                  <span className="hidden max-w-[110px] truncate text-xs font-semibold text-white sm:block">
                    {authUser.name}
                  </span>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                    {authUser.role}
                  </span>
                </button>

                {isAccountMenuOpen && (
                  <div
                    id="nav-account-menu"
                    role="menu"
                    aria-label="Menu akun"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        event.stopPropagation();
                        setIsAccountMenuOpen(false);
                        accountButtonRef.current?.focus();
                      }
                    }}
                    className="absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1.5 text-xs text-[#374151] shadow-xl"
                  >
                    <div className="border-b border-[#F3F4F6] px-3.5 py-2">
                      <p className="truncate font-bold text-[#1E1E1E]">
                        {authUser.name}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#9CA3AF]">
                        {authUser.role}
                      </p>
                    </div>
                    <Link
                      href="/auth/login"
                      role="menuitem"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3.5 py-2 text-left font-medium transition-colors hover:bg-[#FFF4E8] hover:text-[#FF6801]"
                    >
                      Halaman akun
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3.5 py-2 text-left font-medium text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-1 sm:flex">
                <Link
                  href="/auth/login"
                  className="inline-flex h-10 items-center rounded-full px-3 text-xs font-semibold text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex h-10 items-center rounded-full bg-white/15 px-3 text-xs font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/25"
                >
                  Daftar
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => openSellModal()}
              className="flex h-10 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-bold text-[#FF6801] shadow-[0_4px_14px_-8px_rgba(0,0,0,0.5)] transition-colors hover:bg-[#FFF4E8] sm:px-4 sm:text-[13px]"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>Jual</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileNavOpen((value) => !value)}
              aria-label={isMobileNavOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-nav"
              className="grid h-10 w-10 place-items-center rounded-full text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:hidden"
            >
              {isMobileNavOpen ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>

        {/* Menu mobile */}
        {isMobileNavOpen && (
          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-full border-t border-white/15 bg-[#FF6801] px-4 pb-4 pt-3 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.5)] lg:hidden"
          >
            <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/60">
              Kategori
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORY_TABS.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setVisibleCount(8);
                      setIsMobileNavOpen(false);
                    }}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      active
                        ? "bg-white text-[#FF6801]"
                        : "bg-white/15 text-white hover:bg-white/20"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={toggleFavorites}
              aria-pressed={showOnlyLiked}
              className={`mt-3 flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                showOnlyLiked
                  ? "bg-white text-[#FF6801]"
                  : "bg-white/15 text-white hover:bg-white/20"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill={showOnlyLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.5s-7.5-4.4-7.5-9.9A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 3.2c0 5.5-7.5 9.9-7.5 9.9Z"
                  />
                </svg>
                {showOnlyLiked ? "Tampilkan semua produk" : "Produk favorit saya"}
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                {likedCount}
              </span>
            </button>

            {authUser ? (
              <div className="mt-3 rounded-xl bg-white/15 px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[11px] font-black text-[#FF6801]">
                      {getInitials(authUser.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-white">
                        {authUser.name}
                      </span>
                      <span className="block text-[9.5px] uppercase tracking-wide text-white/70">
                        {authUser.role}
                      </span>
                    </span>
                  </span>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#FF6801]"
                  >
                    Akun
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMobileNavOpen(false);
                  }}
                  className="mt-2.5 w-full rounded-full px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/15"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex h-10 items-center justify-center rounded-full text-xs font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/15"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex h-10 items-center justify-center rounded-full bg-white text-xs font-bold text-[#FF6801] transition-colors hover:bg-[#FFF4E8]"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        )}
        </nav>
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
      <div className="border-b border-gray-100 bg-white sticky top-[var(--nav-h)] z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-2.5">
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
      <div className="relative z-20 border-b border-gray-100 bg-white sm:sticky sm:top-[calc(var(--nav-h)+var(--category-h))]">
        <div className="mx-auto max-w-[1360px] space-y-2 px-4 py-2.5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: kontrol filter */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:w-auto">
              {/* Panel filter lengkap (mobile utama, desktop pendamping) */}
              <button
                ref={filterTriggerRef}
                type="button"
                onClick={openFilterSheet}
                aria-haspopup="dialog"
                aria-expanded={isFilterDrawerOpen}
                className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40 sm:order-5 sm:min-h-0 ${
                  activeFilterCount > 0
                    ? "border-[#FF6801] bg-orange-50/60 text-[#FF6801]"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
                <span className="sm:hidden">Filter</span>
                <span className="hidden sm:inline">Semua Filter</span>
                {activeFilterCount > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#FF6801] px-1 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Custom Dropdown */}
              <div className="relative order-2 sm:order-1">
              <button
                ref={sortButtonRef}
                type="button"
                onClick={() => setOpenFilterMenu(openFilterMenu === "sort" ? null : "sort")}
                aria-expanded={openFilterMenu === "sort"}
                aria-haspopup="menu"
                aria-controls="filter-sort-menu"
                aria-label={`Urutkan hasil, saat ini ${SORT_LABELS[sortBy]}`}
                className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40 sm:min-h-0 ${
                  sortBy !== "relevant"
                    ? "border-[#FF6801] bg-orange-50/50 text-[#FF6801] font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-800 bg-white"
                }`}
              >
                <span>
                  <span className="hidden sm:inline">Urutan: </span>
                  <strong className={sortBy !== "relevant" ? "text-[#FF6801]" : "text-gray-900"}>
                    {SORT_LABELS[sortBy]}
                  </strong>
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${openFilterMenu === "sort" ? "rotate-180 text-[#FF6801]" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {openFilterMenu === "sort" && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setOpenFilterMenu(null)}
                    aria-hidden="true"
                  />
                  <div
                    id="filter-sort-menu"
                    ref={sortMenuRef}
                    role="menu"
                    aria-label="Urutkan hasil"
                    onKeyDown={(event) =>
                      handleFilterMenuKeyDown(event, sortButtonRef)
                    }
                    className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Urutkan Hasil
                    </div>
                    {SORT_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={sortBy === item.id}
                        onClick={() => {
                          setSortBy(item.id);
                          setOpenFilterMenu(null);
                          sortButtonRef.current?.focus();
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
            <div className="relative order-3 hidden sm:block">
              <button
                ref={conditionButtonRef}
                type="button"
                onClick={() => setOpenFilterMenu(openFilterMenu === "condition" ? null : "condition")}
                aria-expanded={openFilterMenu === "condition"}
                aria-haspopup="menu"
                aria-controls="filter-condition-menu"
                aria-label="Filter kondisi"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40 ${
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
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setOpenFilterMenu(null)}
                    aria-hidden="true"
                  />
                  <div
                    id="filter-condition-menu"
                    ref={conditionMenuRef}
                    role="menu"
                    aria-label="Pilih kondisi"
                    onKeyDown={(event) =>
                      handleFilterMenuKeyDown(event, conditionButtonRef)
                    }
                    className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Pilih Kondisi
                    </div>
                    {CONDITION_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={conditionFilter === item.id}
                        onClick={() => {
                          setConditionFilter(item.id);
                          setOpenFilterMenu(null);
                          conditionButtonRef.current?.focus();
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
            <div className="relative order-4 hidden sm:block">
              <button
                ref={priceButtonRef}
                type="button"
                onClick={() => setOpenFilterMenu(openFilterMenu === "price" ? null : "price")}
                aria-expanded={openFilterMenu === "price"}
                aria-haspopup="menu"
                aria-controls="filter-price-menu"
                aria-label="Filter harga"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40 ${
                  priceRange !== "all"
                    ? "border-[#FF6801] bg-orange-50/50 text-[#FF6801] font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-800 bg-white"
                }`}
              >
                <span>
                  Harga:{" "}
                  <strong className={priceRange !== "all" ? "text-[#FF6801]" : "text-gray-900"}>
                    {priceRange === "all" ? "Semua" : PRICE_CHIP_LABELS[priceRange]}
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
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setOpenFilterMenu(null)}
                    aria-hidden="true"
                  />
                  <div
                    id="filter-price-menu"
                    ref={priceMenuRef}
                    role="menu"
                    aria-label="Pilih rentang harga"
                    onKeyDown={(event) =>
                      handleFilterMenuKeyDown(event, priceButtonRef)
                    }
                    className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Rentang Harga
                    </div>
                    {PRICE_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={priceRange === item.id}
                        onClick={() => {
                          setPriceRange(item.id);
                          setOpenFilterMenu(null);
                          priceButtonRef.current?.focus();
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

            </div>

            <span className="ml-auto hidden whitespace-nowrap text-xs text-gray-500 sm:inline">
              <strong className="font-bold text-gray-900">{filteredProducts.length}</strong>{" "}
              produk
            </span>
          </div>

          {/* Chip filter aktif */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {conditionFilter !== "all" && (
                <FilterChip
                  label={`Kondisi: ${conditionFilter}`}
                  onRemove={() => setConditionFilter("all")}
                />
              )}
              {priceRange !== "all" && (
                <FilterChip
                  label={`Harga: ${PRICE_CHIP_LABELS[priceRange]}`}
                  onRemove={() => setPriceRange("all")}
                />
              )}
              {selectedLocation !== "Semua Lokasi" && (
                <FilterChip
                  label={`Lokasi: ${selectedLocation}`}
                  onRemove={() => setSelectedLocation("Semua Lokasi")}
                />
              )}
              {showOnlyLiked && (
                <FilterChip
                  label="Hanya favorit"
                  onRemove={() => setShowOnlyLiked(false)}
                />
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-gray-500 underline-offset-2 transition-colors hover:text-[#FF6801] hover:underline"
              >
                Hapus semua
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. MAIN CONTENT & 4-COLUMN PRODUCT GRID */}
      <main
        id="daftar-produk"
        className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6 scroll-mt-[calc(var(--nav-h)+var(--category-h)+3.5rem)] sm:scroll-mt-[calc(var(--nav-h)+var(--category-h)+5.5rem)]"
      >
        {/* Results Count Header */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {filteredProducts.length > 0 ? (
              <>{filteredProducts.length} produk UMKM ditemukan</>
            ) : (
              <>Produk Tidak Ditemukan</>
            )}
          </h1>
          <span className="text-xs text-gray-500">
            Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk
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
                    {p.id === newProductId && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-[#FF6801] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        Baru dipasang
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
                setSelectedLocation("Semua Lokasi");
                setSortBy("relevant");
                setShowOnlyLiked(false);
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
            <button onClick={() => openSellModal()} className="hover:text-white hover:underline transition-colors">
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
      <SellProductModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onAddProduct={handleAddProduct}
        categories={CATEGORY_TABS.filter((c) => c !== "Semua Produk UMKM")}
        locations={LOCATIONS.filter((l) => l !== "Semua Lokasi")}
        authUser={authUser}
      />

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

      {/* DRAWER: SEMUA FILTER */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs sm:items-stretch sm:justify-end"
          onClick={closeFilterSheet}
        >
          <div
            ref={filterSheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sheet-title"
            className="flex max-h-[88vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 sm:h-full sm:max-h-none sm:max-w-md sm:rounded-none sm:slide-in-from-right-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-5 pt-3 sm:pt-5">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-200 sm:hidden" />
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <h3
                    id="filter-sheet-title"
                    className="text-sm font-bold text-gray-900"
                  >
                    Semua Filter
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {draftResultCount} produk sesuai pilihan
                  </p>
                </div>
                <button
                  ref={filterSheetCloseRef}
                  type="button"
                  onClick={closeFilterSheet}
                  aria-label="Tutup filter"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-500 ring-1 ring-inset ring-gray-200 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6801]/40"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
              {/* Lokasi */}
              <div>
                <label
                  htmlFor="filter-location"
                  className="mb-2 block text-xs font-bold text-gray-800"
                >
                  Wilayah / Kota
                </label>
                <select
                  id="filter-location"
                  value={draftFilters.selectedLocation}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      selectedLocation: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-800 focus:border-[#FF6801] focus:outline-none focus:ring-2 focus:ring-[#FF6801]/20"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kondisi */}
              <fieldset>
                <legend className="mb-2 text-xs font-bold text-gray-800">
                  Kondisi Produk
                </legend>
                <div className="space-y-2">
                  {CONDITION_OPTIONS.map((option) => {
                    const checked =
                      draftFilters.conditionFilter === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-xs transition-colors ${
                          checked
                            ? "border-[#FF6801] bg-orange-50/60 font-semibold text-[#C24E00]"
                            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name="filter-condition"
                          value={option.id}
                          checked={checked}
                          onChange={() =>
                            setDraftFilters((current) => ({
                              ...current,
                              conditionFilter: option.id,
                            }))
                          }
                          className="h-4 w-4 accent-[#FF6801]"
                        />
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Harga */}
              <fieldset>
                <legend className="mb-2 text-xs font-bold text-gray-800">
                  Rentang Harga
                </legend>
                <div className="space-y-2">
                  {PRICE_OPTIONS.map((option) => {
                    const checked = draftFilters.priceRange === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-xs transition-colors ${
                          checked
                            ? "border-[#FF6801] bg-orange-50/60 font-semibold text-[#C24E00]"
                            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name="filter-price"
                          value={option.id}
                          checked={checked}
                          onChange={() =>
                            setDraftFilters((current) => ({
                              ...current,
                              priceRange: option.id,
                            }))
                          }
                          className="h-4 w-4 accent-[#FF6801]"
                        />
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Favorit */}
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50">
                <span>
                  Hanya tampilkan produk favorit
                  {likedCount > 0 && (
                    <span className="ml-1.5 text-[10px] font-semibold text-gray-400">
                      ({likedCount} disukai)
                    </span>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={draftFilters.showOnlyLiked}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      showOnlyLiked: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#FF6801]"
                />
              </label>
            </div>

            <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setDraftFilters({ ...DEFAULT_FILTERS })}
                className="rounded-full border border-gray-300 px-4 py-3 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={applyDraftFilters}
                className="flex-1 rounded-full bg-[#FF6801] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#F25E00]"
              >
                Tampilkan {draftResultCount} produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
