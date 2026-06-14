import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FloatingChat from "@/components/FloatingChat";
import {
  ShoppingCart,
  Heart,
  Star,
  Search,
  Truck,
  ShieldCheck,
  CreditCard,
  Clock,
  Wrench,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ===================== DATA ===================== */
const allProducts = [
  {
    id: 1,
    nama: "Sofa Kayu Jati Lentur",
    material: "Kayu Jati & Linen Premium",
    harga: 12500000,
    kategori: "Ruang Tamu",
    gambar:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    rating: 5,
  },
  {
    id: 2,
    nama: "Kursi Santai Rotan Alami",
    material: "Rotan Sintetis & Kayu Mahoni",
    harga: 4200000,
    kategori: "Ruang Tamu",
    gambar:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "New",
    rating: 4,
  },
  {
    id: 3,
    nama: "Ranjang Minimalis Kayu Mangga",
    material: "Kayu Mangga Solid",
    harga: 9800000,
    kategori: "Kamar Tidur",
    gambar:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Promo",
    rating: 4,
  },
  {
    id: 4,
    nama: "Meja Rias Cermin Bundar",
    material: "Kayu Pinus & Cermin",
    harga: 5600000,
    kategori: "Kamar Tidur",
    gambar:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "",
    rating: 3,
  },
  {
    id: 5,
    nama: "Meja Makan Set 6 Kursi",
    material: "Kayu Jati Belanda",
    harga: 18900000,
    kategori: "Ruang Makan",
    gambar:
      "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Hot",
    rating: 5,
  },
  {
    id: 6,
    nama: "Bufet Penyimpanan Kayu Ukir",
    material: "Kayu Suar dengan Ukiran Tangan",
    harga: 14200000,
    kategori: "Ruang Makan",
    gambar:
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "",
    rating: 4,
  },
  {
    id: 7,
    nama: "Kursi Gantung Teras",
    material: "Rotan Alami & Baja Tahan Karat",
    harga: 3800000,
    kategori: "Outdoor",
    gambar:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Eco",
    rating: 4,
  },
  {
    id: 8,
    nama: "Set Meja Teras Minimalis",
    material: "Kayu Merbau & Kaca Tempered",
    harga: 7900000,
    kategori: "Outdoor",
    gambar:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "",
    rating: 4,
  },
];

const categories = [
  {
    name: "Ruang Tamu",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&auto=format",
    slug: "ruang-tamu",
  },
  {
    name: "Kamar Tidur",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&auto=format",
    slug: "kamar-tidur",
  },
  {
    name: "Ruang Makan",
    image:
      "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=400&h=300&fit=crop&auto=format",
    slug: "ruang-makan",
  },
  {
    name: "Outdoor",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&auto=format",
    slug: "outdoor",
  },
];

const testimonials = [
  {
    name: "Rina Anggraini",
    city: "Jakarta",
    stars: 5,
    quote:
      "Furnitur dari FurniCraft membuat rumah saya terasa begitu hangat. Kualitasnya luar biasa, desainnya timeless.",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    name: "Bayu Prasetyo",
    city: "Bandung",
    stars: 5,
    quote:
      "Proses pemesanan sangat personal. Saya merasa dilibatkan dalam setiap detail. Hasilnya melebihi ekspektasi.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Dewi Lestari",
    city: "Surabaya",
    stars: 4,
    quote:
      "Saya suka bagaimana mereka memadukan estetika modern dengan sentuhan alami. Rumah jadi lebih hidup.",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
];

const faqData = [
  {
    question: "Berapa lama pengiriman?",
    answer:
      "Estimasi 3-7 hari kerja tergantung wilayah. Untuk area Jabodetabek biasanya 1-2 hari.",
  },
  {
    question: "Apakah ada garansi?",
    answer: "Ya, semua produk bergaransi 1-3 tahun sesuai jenis produk.",
  },
  {
    question: "Bisa custom warna?",
    answer:
      "Tentu, kami menyediakan layanan custom warna sesuai katalog pilihan.",
  },
  {
    question: "Apakah bisa COD?",
    answer: "COD tersedia untuk area Jabodetabek dan kota besar tertentu.",
  },
];

const keunggulan = [
  { icon: Truck, title: "Gratis Ongkir", desc: "Seluruh Indonesia" },
  { icon: ShieldCheck, title: "Garansi 3 Tahun", desc: "Garansi uang kembali" },
  { icon: CreditCard, title: "Pembayaran Aman", desc: "100% terenkripsi" },
  { icon: Clock, title: "Pengiriman Cepat", desc: "Proses 1x24 jam" },
  { icon: Wrench, title: "Pemasangan Gratis", desc: "Area tertentu" },
];

/* ===================== SCROLL REVEAL ===================== */
const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

const ScrollReveal = ({ children, className = "", delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ===================== IMAGE FALLBACK ===================== */
const handleImageError = (e) => {
  e.target.src =
    "https://placehold.co/400x300/e2e8f0/475569?text=Gambar+Tidak+Tersedia";
};

/* ===================== MAIN ===================== */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 12,
    minutes: 0,
    seconds: 0,
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes = 59;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else clearInterval(timer);
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts =
    activeFilter === "Semua"
      ? allProducts
      : allProducts.filter((p) => p.kategori === activeFilter);

  const filters = [
    "Semua",
    "Ruang Tamu",
    "Kamar Tidur",
    "Ruang Makan",
    "Outdoor",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/cari?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (leadEmail) {
      setIsSubmitted(true);
      setLeadEmail("");
    }
  };

  return (
    <div className="font-poppins text-slate-800 bg-[#F4F4F4]">
      {/* ===== HEADER ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white shadow-md" : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="font-bold text-2xl text-slate-900">
              FurniCraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#koleksi" className="hover:text-indigo-600 transition">
              Koleksi
            </a>
            <a href="#inspirasi" className="hover:text-indigo-600 transition">
              Inspirasi
            </a>
            <a href="#tentang" className="hover:text-indigo-600 transition">
              Tentang
            </a>
            <a href="#kontak" className="hover:text-indigo-600 transition">
              Kontak
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            {/* Search (hidden on mobile) */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2"
            >
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-32"
              />
            </form>

            {/* Cart */}
            <button className="relative p-2 text-slate-600 hover:text-indigo-600 transition">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Login / CTA */}
            <Link
              to="/login"
              className="hidden md:inline-flex text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="hidden md:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition shadow-md"
            >
              Daftar
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 text-2xl font-semibold transition-all duration-500 md:hidden ${
            mobileMenuOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          <button
            className="absolute top-6 right-6 p-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={28} />
          </button>
          <a
            href="#koleksi"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            Koleksi
          </a>
          <a
            href="#inspirasi"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            Inspirasi
          </a>
          <a
            href="#tentang"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            Tentang
          </a>
          <a
            href="#kontak"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            Kontak
          </a>
          <div className="flex flex-col gap-4 w-64">
            <Link
              to="/login"
              className="w-full text-center py-3 text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="w-full text-center py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
            alt="Furniture modern"
            className="w-full h-full object-cover opacity-20"
            onError={handleImageError}
          />
        </div>
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Tersedia Diskon Hingga 40%
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Furniture Modern untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Rumah Impian
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-2xl max-w-2xl mx-auto font-light">
            Temukan sofa, meja, dan kursi dengan desain premium yang nyaman dan
            tahan lama.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/produk"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all"
            >
              Belanja Sekarang
            </Link>
            <Link
              to="/koleksi"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-bold rounded-full hover:bg-white/20 transition"
            >
              Lihat Koleksi
            </Link>
            <Button className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-full hover:bg-amber-300 transition shadow-lg shadow-amber-500/30">
              Konsultasi Gratis
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={36} className="text-white/70" />
        </div>
      </section>

      {/* ===== KATEGORI ===== */}
      <section
        id="koleksi"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#22285E] mb-3">
            Kategori Pilihan
          </h2>
          <p className="text-slate-500 text-lg">
            Jelajahi berbagai jenis furniture sesuai ruangan dan gaya Anda
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <Link
                to={`/kategori/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== PRODUK UNGGULAN ===== */}
      <section id="produk" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#22285E] mb-3">
              Produk Unggulan
            </h2>
            <p className="text-slate-500 text-lg">
              Koleksi terbaik kami dengan ribuan review positif
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm font-medium ${
                  activeFilter === f
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div
            key={activeFilter}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <div className="bg-[#F4F4F4] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.gambar}
                      alt={product.nama}
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-700"
                      onError={handleImageError}
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                        {product.badge}
                      </span>
                    )}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white transition">
                      <Heart size={16} />
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-slate-800 mb-1">
                      {product.nama}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">
                      {product.material}
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < product.rating
                              ? "text-amber-400 fill-current"
                              : "text-slate-300"
                          }
                        />
                      ))}
                      <span className="text-sm text-slate-400 ml-1">(128)</span>
                    </div>
                    <p className="text-xl font-extrabold text-indigo-600 mb-4">
                      Rp {product.harga.toLocaleString("id-ID")}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <Link
                        to={`/produk/${product.id}`}
                        className="flex-1 text-center bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
                      >
                        Detail
                      </Link>
                      <button className="w-12 h-12 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-300 transition">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KEUNGGULAN ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-center text-white shadow-xl">
          {keunggulan.map((item, idx) => (
            <div key={idx} className="space-y-2 group">
              <item.icon size={32} className="mx-auto text-amber-400" />
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-indigo-200 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GALERI INSPIRASI ===== */}
      <section id="inspirasi" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#22285E] mb-3">
              Inspirasi Ruangan
            </h2>
            <p className="text-slate-500 text-lg">
              Lihat furniture kami dalam suasana nyata
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Ruang Tamu */}
            <ScrollReveal delay={150}>
              <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img
                  src="https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=300&fit=crop&auto=format"
                  alt="Ruang Tamu"
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-700"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-white font-bold text-xl">Ruang Tamu</h3>
                </div>
              </div>
            </ScrollReveal>

            {/* Kamar Tidur */}
            <ScrollReveal delay={300}>
              <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop&auto=format"
                  alt="Kamar Tidur"
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-700"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-white font-bold text-xl">Kamar Tidur</h3>
                </div>
              </div>
            </ScrollReveal>

            {/* Ruang Kerja */}
            <ScrollReveal delay={450}>
              <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img
                  src="https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop&auto=format"
                  alt="Ruang Kerja"
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-700"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-white font-bold text-xl">Ruang Kerja</h3>
                </div>
              </div>
            </ScrollReveal>

            {/* Ruang Makan */}
            <ScrollReveal delay={600}>
              <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img
                  src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop&auto=format"
                  alt="Ruang Makan"
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-700"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-white font-bold text-xl">Ruang Makan</h3>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONI ===== */}
      <section
        id="testimoni"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#22285E] mb-3">
            Apa Kata Pelanggan
          </h2>
          <p className="text-slate-500 text-lg">
            Ribuan pelanggan sudah merasakan kualitas kami
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={idx} delay={idx * 150}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-100"
                    onError={handleImageError}
                  />
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-slate-400 text-sm">{t.city}</div>
                  </div>
                </div>
                <div className="flex text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < t.stars ? "fill-current" : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-slate-600 italic">"{t.quote}"</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== PROMO ===== */}
      <section className="py-20 bg-gradient-to-r from-amber-400 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <span className="inline-block bg-slate-900 text-amber-300 text-sm font-bold px-4 py-1 rounded-full">
            FLASH SALE
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Diskon Hingga 40%
          </h2>
          <p className="text-slate-800 text-lg">
            Promo akhir pekan terbatas! Jangan sampai ketinggalan.
          </p>
          <div className="flex justify-center gap-3 text-2xl font-mono font-bold text-slate-900 bg-white/30 backdrop-blur-sm rounded-2xl py-5 px-8 max-w-md mx-auto">
            <span>{String(countdown.days).padStart(2, "0")}d</span>:
            <span>{String(countdown.hours).padStart(2, "0")}h</span>:
            <span>{String(countdown.minutes).padStart(2, "0")}m</span>:
            <span>{String(countdown.seconds).padStart(2, "0")}s</span>
          </div>
          <Link
            to="/promo"
            className="inline-block px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition shadow-xl shadow-slate-900/30"
          >
            Belanja Sekarang
          </Link>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="tentang" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal className="order-2 md:order-1">
            <h2 className="text-4xl font-bold text-[#22285E] mb-6">
              Tentang FurniCraft
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Sejak 2015, kami menghadirkan furniture premium dengan material
              kayu pilihan terbaik. Setiap produk dirancang oleh pengrajin
              berpengalaman untuk memberikan kenyamanan dan keindahan di rumah
              Anda.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-extrabold text-indigo-600">
                  8+
                </div>
                <div className="text-slate-500 text-sm">Tahun</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-indigo-600">
                  50K+
                </div>
                <div className="text-slate-500 text-sm">Pelanggan</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-indigo-600">
                  100%
                </div>
                <div className="text-slate-500 text-sm">Kayu Asli</div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200} className="order-1 md:order-2">
            <img
              src="https://plus.unsplash.com/premium_photo-1684338795288-097525d127f0?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Kerajinan kami"
              className="rounded-3xl shadow-2xl w-full"
              onError={handleImageError}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section
        id="faq"
        className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#22285E] mb-3">
            Pertanyaan Umum
          </h2>
        </ScrollReveal>
        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 font-medium text-slate-800 flex justify-between items-center hover:bg-slate-50 transition"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {item.question}
                  <span
                    className={`transform transition-transform duration-300 text-2xl ${openFaq === idx ? "rotate-45 text-indigo-600" : "text-slate-400"}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out ${openFaq === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
                >
                  <div className="px-6 pb-4 text-slate-600 border-t border-slate-100 pt-3 bg-slate-50/50">
                    {item.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section id="kontak" className="py-20 bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Dapatkan Promo Eksklusif</h2>
          <p className="text-slate-400">
            Berlangganan newsletter kami dan dapatkan diskon 20% pertama Anda
          </p>
          {!isSubmitted ? (
            <form
              onSubmit={handleNewsletter}
              className="flex gap-2 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Alamat email Anda"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                required
                className="flex-1 bg-slate-800 border-slate-700 rounded-full text-white placeholder-slate-500 focus:ring-amber-400"
              />
              <Button
                type="submit"
                className="bg-amber-400 text-slate-900 font-bold rounded-full px-6 hover:bg-amber-300 transition"
              >
                Klaim
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-600/20 border border-emerald-500 rounded-xl text-emerald-300 font-semibold max-w-md mx-auto">
              🎉 Terima kasih! Kode voucher diskon 20% telah dikirim ke email
              Anda.
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4">Tentang</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tentang" className="hover:text-amber-400 transition">
                  Cerita Kami
                </Link>
              </li>
              <li>
                <Link to="/tim" className="hover:text-amber-400 transition">
                  Tim
                </Link>
              </li>
              <li>
                <Link to="/karir" className="hover:text-amber-400 transition">
                  Karir
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Katalog</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/kategori/${cat.slug}`}
                    className="hover:text-amber-400 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li>📞 0812-3456-7890</li>
              <li>📧 halo@furnicraft.id</li>
              <li>📍 Jl. Kayu No.10, Jakarta</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-slate-900 transition"
              >
                <span className="text-sm font-bold">IG</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-slate-900 transition"
              >
                <span className="text-sm font-bold">TT</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-slate-900 transition"
              >
                <span className="text-sm font-bold">PIN</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-sm text-center">
          &copy; {new Date().getFullYear()} FurniCraft. All rights reserved. |{" "}
          <Link to="/privacy" className="hover:text-amber-400 transition">
            Kebijakan Privasi
          </Link>
        </div>
      </footer>

      {/* ===== FLOATING CHATBOT ===== */}
      <FloatingChat />

      {/* ===== FLOATING WHATSAPP ===== */}
      <div className="fixed bottom-6 right-6 z-50 group flex flex-col items-end">
        <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Ada pertanyaan? Chat kami 😊
        </div>
        <a
          href="https://wa.me/6281234567890?text=Halo%20FurniCraft%2C%20saya%20mau%20tanya%20soal%20produk"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 hover:rotate-12 transition-all"
        >
          <MessageCircle size={28} />
        </a>
      </div>
    </div>
  );
}
