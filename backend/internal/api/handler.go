package api

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Server holds application state and dependencies such as database connection.
type Server struct {
	DB *pgxpool.Pool
}

// Product represents an item for the Sentra UMKM marketplace.
type Product struct {
	ID             string  `json:"id"`
	SellerInitials string  `json:"sellerInitials"`
	SellerColor    string  `json:"sellerColor"`
	SellerName     string  `json:"sellerName"`
	TimeAgo        string  `json:"timeAgo"`
	Badge          string  `json:"badge,omitempty"`
	BadgeColor     string  `json:"badgeColor,omitempty"`
	Image          string  `json:"image"`
	ImageTag       string  `json:"imageTag,omitempty"`
	Name           string  `json:"name"`
	Price          float64 `json:"price"`
	Category       string  `json:"category"`
	Condition      string  `json:"condition"`
	Location       string  `json:"location"`
	Likes          int     `json:"likes"`
	Description    string  `json:"description,omitempty"`
}

var sampleProducts = []Product{
	{
		ID:             "1",
		SellerInitials: "RK",
		SellerColor:    "bg-[#1E1E1E]",
		SellerName:     "ratna.kriya",
		TimeAgo:        "3 menit lalu",
		Badge:          "Kurasi Sentra",
		BadgeColor:     "text-[#FF6801] border-[#FF6801]/30 bg-orange-50/50",
		Image:          "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "Handmade",
		Name:           "Tas Anyaman Jali Ukuran M - Warna Sage Pastel Awet & Tahan Air",
		Price:          65000,
		Category:       "Anyaman & Kerajinan Rotan",
		Condition:      "Baru",
		Location:       "Ponorogo",
		Likes:          8,
		Description:    "Dibuat tangan oleh pengrajin lokal Ponorogo dengan bahan plastik daur ulang jali premium yang kuat, elastis, dan tahan air. Cocok untuk belanja harian maupun pelengkap gaya santai.",
	},
	{
		ID:             "2",
		SellerInitials: "NT",
		SellerColor:    "bg-[#D97706]",
		SellerName:     "nusantara.tenun",
		TimeAgo:        "14 menit lalu",
		Badge:          "Asli Pengrajin",
		BadgeColor:     "text-[#D97706] border-[#D97706]/30 bg-amber-50/50",
		Image:          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "Pewarna Alam",
		Name:           "Kain Tenun Ikat Asli NTT Motif Flores Tradisional Lembut",
		Price:          320000,
		Category:       "Batik & Kain Tenun",
		Condition:      "Baru",
		Location:       "Kupang",
		Likes:          24,
		Description:    "Tenun ikat asli Flores NTT ditenun secara tradisional menggunakan alat tenun bukan mesin (ATBM) dengan pewarnaan alami dari akar mengkudu dan daun tarum.",
	},
	{
		ID:             "3",
		SellerInitials: "KG",
		SellerColor:    "bg-[#374151]",
		SellerName:     "kopi.gayo.asli",
		TimeAgo:        "25 menit lalu",
		Badge:          "",
		BadgeColor:     "",
		Image:          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "",
		Name:           "Biji Kopi Arabika Aceh Gayo Specialty Roast Bean 250gr Fresh Roasting",
		Price:          85000,
		Category:       "Biji Kopi Lokal & Rempah",
		Condition:      "Baru",
		Location:       "Aceh Tengah",
		Likes:          19,
		Description:    "Biji kopi arabika single origin dari dataran tinggi Takengon Aceh Gayo. Profil roasting medium dengan citra rasa floral, caramel, dan acidity yang seimbang.",
	},
	{
		ID:             "4",
		SellerInitials: "AA",
		SellerColor:    "bg-[#991B1B]",
		SellerName:     "atsiri.alami",
		TimeAgo:        "1 jam lalu",
		Badge:          "",
		BadgeColor:     "",
		Image:          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "",
		Name:           "Minyak Atsiri Sereh Wangi Citronella Asli 100% Sulingan Petani",
		Price:          45000,
		Category:       "Herbal & Minyak Atsiri",
		Condition:      "Baru",
		Location:       "Karanganyar",
		Likes:          5,
		Description:    "Murni 100% tanpa campuran pelarut atau minyak sintetis. Disuling langsung dari daun sereh wangi petani lereng Gunung Lawu Karanganyar.",
	},
	{
		ID:             "5",
		SellerInitials: "GW",
		SellerColor:    "bg-[#B45309]",
		SellerName:     "gerabah.wetan",
		TimeAgo:        "2 jam lalu",
		Badge:          "",
		BadgeColor:     "",
		Image:          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "",
		Name:           "Cangkir Keramik Kasongan Hand-thrown Glaze Terracotta 220ml",
		Price:          38000,
		Category:       "Gerabah & Keramik Kasongan",
		Condition:      "Baru",
		Location:       "Bantul",
		Likes:          11,
		Description:    "Cangkir buatan tangan dari sentra gerabah Kasongan Bantul Yogyakarta. Melewati proses pembakaran suhu tinggi dengan glasir food-grade alami.",
	},
	{
		ID:             "6",
		SellerInitials: "MH",
		SellerColor:    "bg-[#78350F]",
		SellerName:     "madu.hutan.sumbawa",
		TimeAgo:        "3 jam lalu",
		Badge:          "",
		BadgeColor:     "",
		Image:          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "",
		Name:           "Madu Hutan Liar Murni Asli Sumbawa Raw Honey 500 gram Panen Baru",
		Price:          115000,
		Category:       "Herbal & Minyak Atsiri",
		Condition:      "Baru",
		Location:       "Sumbawa",
		Likes:          32,
		Description:    "Madu mentah alami tanpa pasteurisasi hasil panen lebah Apis Dorsata di hutan belantara Sumbawa. Kaya enzim aktif dan antioksidan tinggi.",
	},
	{
		ID:             "7",
		SellerInitials: "KJ",
		SellerColor:    "bg-[#EA580C]",
		SellerName:     "kayu.jati.kreatif",
		TimeAgo:        "4 jam lalu",
		Badge:          "",
		BadgeColor:     "",
		Image:          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "",
		Name:           "Talenan & Piring Kayu Jati Perhutani Tebal Finishing Beeswax Organik",
		Price:          55000,
		Category:       "Peralatan Kayu Jati",
		Condition:      "Baru",
		Location:       "Jepara",
		Likes:          17,
		Description:    "Diproduksi di Jepara dengan kayu jati perhutani pilihan berurat indah. Dilapisi lilin lebah alami (natural beeswax) 100% aman untuk makanan.",
	},
	{
		ID:             "8",
		SellerInitials: "BT",
		SellerColor:    "bg-[#6D28D9]",
		SellerName:     "batik.tulis.lasem",
		TimeAgo:        "5 jam lalu",
		Badge:          "",
		BadgeColor:     "",
		Image:          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
		ImageTag:       "Preloved Istimewa",
		Name:           "Selendang Sutra Batik Tulis Lasem Tiga Negeri Koleksi Pribadi Mulus",
		Price:          450000,
		Category:       "Batik & Kain Tenun",
		Condition:      "Like new",
		Location:       "Rembang",
		Likes:          42,
		Description:    "Karya master batik Lasem motif Tiga Negeri dengan perpaduan warna merah darah ayam khas Lasem, biru Pekalongan, dan sogan Solo. Kondisi sangat terawat.",
	},
}

// HealthHandler returns API health and PostgreSQL connection status.
func (s *Server) HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	dbStatus := "disconnected"
	if s.DB != nil {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()
		if err := s.DB.Ping(ctx); err == nil {
			dbStatus = "connected"
		}
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":    "ok",
		"message":   "Backend Sentra UMKM Marketplace API is running",
		"db_status": dbStatus,
	})
}

// ProductsHandler returns products, supporting search, category, and sorting filters.
func (s *Server) ProductsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodPost {
		var newProduct Product
		if err := json.NewDecoder(r.Body).Decode(&newProduct); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		newProduct.ID = string(rune('0' + len(sampleProducts) + 1))
		if newProduct.SellerInitials == "" && len(newProduct.SellerName) > 0 {
			parts := strings.Split(newProduct.SellerName, ".")
			if len(parts) > 1 && len(parts[0]) > 0 && len(parts[1]) > 0 {
				newProduct.SellerInitials = strings.ToUpper(parts[0][:1] + parts[1][:1])
			} else {
				newProduct.SellerInitials = strings.ToUpper(newProduct.SellerName[:1])
			}
		}
		if newProduct.SellerColor == "" {
			newProduct.SellerColor = "bg-[#FF6801]"
		}
		if newProduct.TimeAgo == "" {
			newProduct.TimeAgo = "Baru saja"
		}
		sampleProducts = append([]Product{newProduct}, sampleProducts...)
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(newProduct)
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(sampleProducts)
}
