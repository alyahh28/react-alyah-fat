import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingChat from "@/components/FloatingChat";
import Logo from "../assets/Logo.png";
import { authAPI } from "../services/authAPI";
import { useCart } from "../context/CartContext";
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
  Ticket,
  Crown,
  LogOut,
  User,
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
    nama: "Meja Cermin Bundar",
    material: "Kayu Pinus & Cermin",
    harga: 5600000,
    kategori: "Kamar Tidur",
    gambar:
      "https://images.unsplash.com/photo-1765745518752-68a289300789?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D  ",
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
      "https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "Hot",
    rating: 5,
  },
  {
    id: 6,
    nama: "Ruang Makan Minimalis ",
    material: "Kayu Suar dengan Ukiran Tangan",
    harga: 14200000,
    kategori: "Ruang Makan",
    gambar:
      "https://images.unsplash.com/photo-1723750290151-164cb19ebab7?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    nama: "Set Meja dan kursi Teras Minimalis",
    material: "Kayu Merbau & Kaca Tempered",
    harga: 7900000,
    kategori: "Outdoor",
    gambar:
      "https://images.unsplash.com/photo-1600210492090-a159ffa3aeaf?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "",
    rating: 4,
  },
];

const categories = [
  {
    name: "Ruang Tamu",
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1092&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      { threshold }
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
  const navigate = useNavigate();
  const { addToCart, toggleCart, totalItemsCount } = useCart();
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State untuk Kode Promo
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);
  const [isPromoError, setIsPromoError] = useState(false);

  // ========== STATE LOGIN / LOGOUT ==========
  const [activeUser, setActiveUser] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [userTier, setUserTier] = useState("Bronze");

  useEffect(() => {
    const user = localStorage.getItem("activeUser");
    if (user) {
      setActiveUser(user);
      authAPI.getCurrentUser().then(userData => {
        if (userData && userData.profile) {
          setUserPoints(userData.profile.points || 0);
          setUserTier(userData.profile.tier || "Bronze");
        }
      }).catch(err => console.error("Error getting user tier:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setActiveUser("");
    navigate("/");
  };
  // ==========================================

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      if (element) {
        // Offset for the fixed header
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

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
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (leadEmail) {
      try {
        const promo = await authAPI.generatePromoCode(leadEmail);
        setIsSubmitted(true);
        setLeadEmail("");
        alert(`🎉 Selamat! Kode promo eksklusif Anda: ${promo.code}\n\nSimpan kode ini dan gunakan untuk mendapatkan diskon ${promo.discount_percent}%!`);
      } catch (err) {
        console.error("Gagal generate promo:", err);
        alert("Gagal membuat kode promo, coba lagi nanti.");
      }
    }
  };

  // Logika Kode Promo
  const handlePromoCode = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      setPromoMessage("Kode promo tidak boleh kosong!");
      setIsPromoError(true);
      return;
    }
    
    try {
      const discount = await authAPI.validatePromoCode(promoCode.trim().toUpperCase());
      if (discount) {
        setPromoMessage(`🎉 Selamat! Kode berhasil divalidasi. Anda mendapat tambahan diskon ${discount}%.`);
        setIsPromoError(false);
        localStorage.setItem("appliedPromo", discount.toString());
      } else {
        setPromoMessage("Kode promo tidak valid atau sudah kadaluarsa.");
        setIsPromoError(true);
      }
    } catch (err) {
      console.error("Gagal validasi promo:", err);
      setPromoMessage("Terjadi kesalahan sistem, coba lagi.");
      setIsPromoError(true);
    }
  };

  return (
    <div className="font-poppins text-slate-800 bg-[#FAFAFA]">
      {/* ===== HEADER ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-md border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-200 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30 overflow-hidden">
              <img 
                src={Logo} 
                alt="FurniCraft Logo" 
                className="w-full h-full object-cover p-1.5" 
              />
            </div>
            <span className={`font-bold text-2xl transition-colors duration-300 ${scrolled ? "text-slate-900" : "text-white"}`}>
              FurniCraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#" onClick={(e) => scrollToSection(e, 'home')} className={`hover:text-indigo-600 transition ${scrolled ? "text-slate-600" : "text-white/80 hover:text-white"}`}>
              Home
            </a>
            <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className={`hover:text-indigo-600 transition ${scrolled ? "text-slate-600" : "text-white/80 hover:text-white"}`}>
              Tentang
            </a>
            <a href="#produk" onClick={(e) => scrollToSection(e, 'produk')} className={`hover:text-indigo-600 transition ${scrolled ? "text-slate-600" : "text-white/80 hover:text-white"}`}>
              Product
            </a>
            <a href="#member" onClick={(e) => scrollToSection(e, 'member')} className={`hover:text-indigo-600 transition ${scrolled ? "text-slate-600" : "text-white/80 hover:text-white"}`}>
              Promo
            </a>
            <a href="#inspirasi" onClick={(e) => scrollToSection(e, 'inspirasi')} className={`hover:text-indigo-600 transition ${scrolled ? "text-slate-600" : "text-white/80 hover:text-white"}`}>
              Inspirasi
            </a>
            <a href="#testimoni" onClick={(e) => scrollToSection(e, 'testimoni')} className={`hover:text-indigo-600 transition ${scrolled ? "text-slate-600" : "text-white/80 hover:text-white"}`}>
              Ulasan
            </a>
            <a href="#kontak" onClick={(e) => scrollToSection(e, 'kontak')} className={`hover:text-indigo-600 transition ${scrolled ? "text-slate-600" : "text-white/80 hover:text-white"}`}>
              Kontak
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
            >
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent border-none text-sm text-white placeholder-slate-300 focus:outline-none w-32"
              />
            </form>

            <button 
              onClick={toggleCart}
              className={`relative p-2.5 transition rounded-full hover:bg-white/10 ${scrolled ? "text-slate-700 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}
            >
              <ShoppingCart size={20} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[11px] rounded-full flex items-center justify-center font-black shadow-md animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* ========== KONDISI LOGIN / LOGOUT (DESKTOP) ========== */}
            {activeUser ? (
              <div className="hidden md:flex items-center space-x-3">
                {/* User Profile Badge */}
                <Link
                  to="/member"
                  className={`flex items-center gap-2 text-sm font-semibold transition`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    scrolled
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-white/15 text-white"
                  }`}>
                    <User size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`transition-colors duration-300 ${scrolled ? "text-slate-700" : "text-white/90"}`}>
                      {activeUser}
                    </span>
                    {userPoints > 0 && (
                      <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${scrolled ? "text-amber-500" : "text-amber-300"}`}>
                        <Crown size={10} /> {userTier} ({userPoints} Pts)
                      </span>
                    )}
                  </div>
                </Link>

                {/* Divider */}
                <div className={`w-px h-5 transition-colors duration-300 ${scrolled ? "bg-slate-200" : "bg-white/20"}`}></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full"
                >
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`text-sm font-semibold transition ${scrolled ? "text-slate-700 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition shadow-md shadow-indigo-600/30"
                >
                  Daftar
                </Link>
              </div>
            )}
            {/* ===================================================== */}

            <button
              className={`md:hidden p-2 transition ${scrolled ? "text-slate-600" : "text-white"}`}
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
          <a href="#" onClick={(e) => { scrollToSection(e, 'home'); setMobileMenuOpen(false); }} className="hover:text-indigo-600">Home</a>
          <a href="#tentang" onClick={(e) => { scrollToSection(e, 'tentang'); setMobileMenuOpen(false); }} className="hover:text-indigo-600">Tentang</a>
          <a href="#produk" onClick={(e) => { scrollToSection(e, 'produk'); setMobileMenuOpen(false); }} className="hover:text-indigo-600">Product</a>
          <a href="#member" onClick={(e) => { scrollToSection(e, 'member'); setMobileMenuOpen(false); }} className="hover:text-indigo-600">Promo</a>
          <a href="#inspirasi" onClick={(e) => { scrollToSection(e, 'inspirasi'); setMobileMenuOpen(false); }} className="hover:text-indigo-600">Inspirasi</a>
          <a href="#testimoni" onClick={(e) => { scrollToSection(e, 'testimoni'); setMobileMenuOpen(false); }} className="hover:text-indigo-600">Ulasan</a>
          <a href="#kontak" onClick={(e) => { scrollToSection(e, 'kontak'); setMobileMenuOpen(false); }} className="hover:text-indigo-600">Kontak</a>
          
          {/* ========== KONDISI LOGIN / LOGOUT (MOBILE) ========== */}
          {activeUser ? (
            <div className="flex flex-col gap-4 w-64">
              <Link
                to="/member"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100 transition"
              >
                <User size={18} /> {activeUser}
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-center py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Keluar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-64">
              <Link to="/login" className="w-full text-center py-3 text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 transition" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
              <Link to="/register" className="w-full text-center py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition" onClick={() => setMobileMenuOpen(false)}>Daftar</Link>
            </div>
          )}
          {/* ===================================================== */}
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
            alt="Furniture modern"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            onError={handleImageError}
          />
        </div>
        
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold text-white/90 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Tersedia Diskon Hingga 40% untuk Member
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold text-white leading-tight tracking-tight">
            Ruang Utama,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                Furniture Premium
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            Temukan sofa, meja, dan kursi dengan desain premium yang nyaman dan tahan lama. Kualitas tanpa kompromi untuk hunian idaman Anda.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Link
              to="/guest/products"
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all flex items-center gap-2"
            >
              Belanja Sekarang
              <ShoppingCart size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/koleksi"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-bold rounded-full hover:bg-white/20 transition"
            >
              Lihat Koleksi
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={36} className="text-white/50" />
        </div>
      </section>

      {/* ===== KATEGORI ===== */}
      <section id="koleksi" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Koleksi Kami</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
            Kategori Pilihan
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Jelajahi berbagai jenis furniture sesuai ruangan dan gaya Anda
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setActiveFilter(cat.name);
                  document.getElementById("produk").scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-900 h-64 flex items-end w-full text-left cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-70 group-hover:opacity-90"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-6">
                  <h3 className="text-white font-bold text-2xl drop-shadow-md">
                    {cat.name}
                  </h3>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== PRODUK UNGGULAN ===== */}
      <section id="produk" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Produk Terbaik</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
              Produk Unggulan
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Koleksi terbaik kami dengan ribuan review positif
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2.5 rounded-full border transition-all duration-300 text-sm font-semibold ${
                  activeFilter === f
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30"
                    : "border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 bg-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div key={activeFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 100}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col group h-full">
                    <div className="relative overflow-hidden">
                      <Link to={`/guest/products/${product.id}`}>
                        <img
                          src={product.gambar || product.thumbnail || "https://placehold.co/400x300"}
                          alt={product.nama || product.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition duration-700 cursor-pointer"
                          onError={handleImageError}
                        />
                      </Link>
                      {(product.badge || index === 0) && (
                        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          {product.badge || "New"}
                        </span>
                      )}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white shadow-md transition">
                          <Heart size={18} />
                        </button>
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-white shadow-md transition"
                          title="Tambah ke Keranjang"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                        {product.kategori || product.category || "Furnitur"}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">
                        {product.nama || product.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-1">
                        {product.material || product.description || "Furnitur kayu berkualitas"}
                      </p>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < (product.rating || 4)
                                ? "text-amber-400 fill-current"
                                : "text-slate-200"
                            }
                          />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">(128)</span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xl font-extrabold text-slate-900">
                          Rp {(product.harga || product.price || 0).toLocaleString("id-ID")}
                        </p>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                        >
                          <ChevronDown size={18} className="-rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
        </div>
      </section>

      {/* ===== GALERI INSPIRASI ===== */}
      <section id="inspirasi" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Inspirasi</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
              Suasana Ruangan Impian
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Lihat furniture kami dalam dekorasi nyata yang memukau
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Ruang Tamu", img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1092&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Kamar Tidur", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop&auto=format" },
              { name: "Ruang Kerja", img: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop&auto=format" },
              { name: "Ruang Makan", img: "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-80">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                    <h3 className="text-white font-bold text-2xl drop-shadow-md">{item.name}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MEMBER & KODE PROMO ===== */}
      <section id="member" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
              
              <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
                <div className="text-white space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-semibold text-amber-300">
                    <Crown size={16} /> Keuntungan Member
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold">
                    Gabung Member FurniCraft 🎉
                  </h2>
                  <p className="text-indigo-100 leading-relaxed">
                    Dapatkan akses eksklusif ke Flash Sale, promo bulanan, dan voucher pengguna baru. Masukkan kode promo Anda di bawah ini untuk klaim diskon langsung!
                  </p>
                  <ul className="space-y-2 text-sm text-indigo-100">
                    <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-300" /> Garansi uang kembali 100%</li>
                    <li className="flex items-center gap-2"><Truck size={16} className="text-amber-300" /> Gratis ongkir tanpa minimum belanja</li>
                    <li className="flex items-center gap-2"><Ticket size={16} className="text-amber-300" /> Voucher ulang tahun & promo khusus</li>
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-2">Klaim Kode Promo</h3>
                  <p className="text-indigo-200 text-sm mb-6">Sudah punya kode? Masukkan di sini.</p>
                  
                  {!promoMessage ? (
                    <form onSubmit={handlePromoCode} className="space-y-4">
                      <div className="relative">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Masukkan kode promo..."
                          className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold rounded-xl hover:opacity-90 transition shadow-md shadow-amber-500/30 flex items-center justify-center gap-2"
                      >
                        <Ticket size={18} /> Gunakan Kode
                      </button>
                      <p className="text-xs text-indigo-300 text-center">Coba masukkan kode: <span className="font-bold text-amber-300">FURNI20</span></p>
                    </form>
                  ) : (
                    <div className={`p-4 rounded-xl text-center ${isPromoError ? 'bg-red-500/20 border border-red-400/30 text-red-200' : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-200'}`}>
                      <p className="font-semibold text-lg mb-2">{isPromoError ? '❌ Gagal' : '✅ Berhasil'}</p>
                      <p className="text-sm">{promoMessage}</p>
                      <button 
                        onClick={() => { setPromoMessage(null); setPromoCode(""); setIsPromoError(false); }}
                        className="mt-4 text-xs underline hover:text-white transition"
                      >
                        Coba kode lain
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="tentang" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal className="order-2 md:order-1">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Cerita Kami</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-6">
              Tentang FurniCraft
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              Sejak 2015, kami menghadirkan furniture premium dengan material kayu pilihan terbaik. Setiap produk dirancang oleh pengrajin berpengalaman untuk memberikan kenyamanan dan keindahan di rumah Anda.
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div><div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">8+</div><div className="text-slate-500 text-sm mt-1">Tahun</div></div>
              <div><div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">50K+</div><div className="text-slate-500 text-sm mt-1">Pelanggan</div></div>
              <div><div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">100%</div><div className="text-slate-500 text-sm mt-1">Kayu Asli</div></div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200} className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-3xl rotate-2"></div>
              <img
                src="https://plus.unsplash.com/premium_photo-1684338795288-097525d127f0?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Kerajinan kami"
                className="rounded-3xl shadow-2xl w-full relative"
                onError={handleImageError}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section id="kontak" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold">Dapatkan Promo Eksklusif</h2>
          <p className="text-slate-400 text-lg">
            Berlangganan newsletter kami dan dapatkan diskon 20% pertama Anda
          </p>
          {!isSubmitted ? (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
              <Input
                type="email"
                placeholder="Alamat email Anda"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                required
                className="flex-1 bg-slate-800 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4"
              />
              <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl px-6 h-12 hover:opacity-90 transition shadow-md">
                Klaim Diskon
              </Button>
            </form>
          ) : (
            <div className="p-5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-semibold max-w-md mx-auto mt-8">
              🎉 Terima kasih! Kode voucher diskon 20% telah dikirim ke email Anda.
            </div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONI ===== */}
      <section id="testimoni" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Testimoni</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
              Apa Kata Pelanggan
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Ribuan pelanggan sudah merasakan kualitas kami
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className={i < t.stars ? "fill-current" : "text-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 italic mb-6 flex-1 text-lg leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100" onError={handleImageError} />
                    <div>
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-slate-400 text-sm">{t.city}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="font-bold text-2xl text-white">FurniCraft</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">Menghadirkan furniture premium dengan material kayu pilihan terbaik sejak 2015.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Navigasi</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-indigo-400 transition">Home</a></li>
              <li><a href="#produk" onClick={(e) => scrollToSection(e, 'produk')} className="hover:text-indigo-400 transition">Product</a></li>
              <li><a href="#inspirasi" onClick={(e) => scrollToSection(e, 'inspirasi')} className="hover:text-indigo-400 transition">Inspirasi</a></li>
              <li><a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className="hover:text-indigo-400 transition">Tentang Kami</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">📞 0812-3456-7890</li>
              <li className="flex items-center gap-2">📧 halo@furnicraft.id</li>
              <li className="flex items-center gap-2">📍 Jl. Kayu No.10, Jakarta</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                <span className="text-sm font-bold">IG</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                <span className="text-sm font-bold">TT</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                <span className="text-sm font-bold">FB</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-sm text-center text-slate-600">
          &copy; {new Date().getFullYear()} FurniCraft. All rights reserved. |{" "}
          <Link to="/privacy" className="hover:text-indigo-400 transition">
            Kebijakan Privasi
          </Link>
        </div>
      </footer>

      {/* ===== FLOATING CHATBOT ===== */}
      <FloatingChat />

      {/* ===== PRODUCT QUICK VIEW MODAL ===== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row transform transition-all">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white shadow-sm transition"
            >
              <X size={20} />
            </button>
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100">
              <img 
                src={selectedProduct.gambar || selectedProduct.thumbnail || "https://placehold.co/800x800"} 
                alt={selectedProduct.nama} 
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">
                {selectedProduct.kategori || "Furnitur"}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                {selectedProduct.nama || selectedProduct.title}
              </h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < (selectedProduct.rating || 4) ? "fill-current" : "text-slate-200"} />
                  ))}
                </div>
                <span className="text-sm text-slate-500">(128 Ulasan)</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                {selectedProduct.deskripsi || selectedProduct.description || `${selectedProduct.nama || "Produk ini"} dibuat dengan ${selectedProduct.material || "material premium pilihan"}. Dirancang untuk memberikan kenyamanan maksimal dan ketahanan jangka panjang, cocok untuk melengkapi keindahan rumah Anda.`}
              </p>
              
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Material Utama</h4>
                <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                  <Wrench size={16} className="text-indigo-500" />
                  <span className="text-sm text-slate-700 font-medium">{selectedProduct.material || "Material Premium"}</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="text-sm text-slate-500 block mb-1">Harga Spesial</span>
                  <p className="text-3xl font-black text-slate-900">
                    Rp {(selectedProduct.harga || selectedProduct.price || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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