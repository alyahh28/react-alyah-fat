import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import {
  User,
  Award,
  LogOut,
  Star,
  Gift,
  Search,
  CheckCircle,
  Clock,
  Ticket,
  Heart,
  ShoppingCart,
  Crown,
} from "lucide-react";

/* ===================== DATA PRODUK ===================== */
const memberProducts = [
  { id: 1, nama: "Sofa Jati Minimalis", harga: 4500000, poin: 450, kategori: "Ruang Tamu", gambar: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60", badge: "Best Seller" },
  { id: 2, nama: "Kursi Kerja Ergonomis", harga: 1800000, poin: 180, kategori: "Ruang Kerja", gambar: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60", badge: "New" },
  { id: 3, nama: "Meja Makan Kayu Mahoni", harga: 6200000, poin: 620, kategori: "Dapur", gambar: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=500&auto=format&fit=crop&q=60", badge: "Premium" },
  { id: 4, nama: "Tempat Tidur King Size", harga: 8500000, poin: 850, kategori: "Kamar Tidur", gambar: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop&q=60", badge: "Hot" },
  { id: 5, nama: "Lemari Pakaian Minimalis", harga: 3200000, poin: 320, kategori: "Kamar Tidur", gambar: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60", badge: "" },
  { id: 6, nama: "Rak Buku Kayu Gantung", harga: 750000, poin: 75, kategori: "Ruang Kerja", gambar: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500&auto=format&fit=crop&q=60", badge: "Eco" },
  { id: 7, nama: "Lampu Hias Sudut Ruangan", harga: 450000, poin: 45, kategori: "Dekorasi", gambar: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60", badge: "New" },
  { id: 8, nama: "Karpet Lembut Bohemian", harga: 1200000, poin: 120, kategori: "Dekorasi", gambar: "https://images.unsplash.com/photo-1579656335182-67491d34006c?w=500&auto=format&fit=crop&q=60", badge: "" },
];

/* ===================== DATA REWARD CRM ===================== */
const crmRewards = [
  { id: "R1", title: "Potongan Langsung Rp 50.000", cost: 200, deskripsi: "Tanpa minimum transaksi" },
  { id: "R2", title: "Gratis Ongkir se-Jawa & Bali", cost: 350, deskripsi: "Maksimal subsidi Rp 150.000" },
  { id: "R3", title: "Voucher Cashback FurniCraft 10%", cost: 500, deskripsi: "Hingga maksimal Rp 300.000" },
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

/* ===================== MAIN COMPONENT ===================== */
export default function MemberDashboard() {
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [scrolled, setScrolled] = useState(false);

  // --- STATE CRM / MANAGEMENT POIN ---
  const [userPoints, setUserPoints] = useState(1250);
  const [pointHistory, setPointHistory] = useState([
    { id: 1, aktivitas: "Pembelian Kursi Kerja", tipe: "plus", jumlah: 180, tanggal: "12 Juni 2026" },
    { id: 2, aktivitas: "Bonus Pendaftaran Akun", tipe: "plus", jumlah: 200, tanggal: "01 Juni 2026" },
    { id: 3, aktivitas: "Tukar Voucher Belanja Rp 100k", tipe: "minus", jumlah: 400, tanggal: "05 Juni 2026" },
  ]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [crmMessage, setCrmMessage] = useState("");

  // Menentukan Tier otomatis berdasarkan poin CRM
  const getMemberTier = (points) => {
    if (points >= 2000) return { name: "Platinum Member", bar: "w-full", next: 0, icon: "💎" };
    if (points >= 1000) return { name: "Gold Member", bar: "w-[65%]", next: 2000 - points, icon: "👑" };
    return { name: "Silver Member", bar: "w-[35%]", next: 1000 - points, icon: "🥈" };
  };

  const currentTier = getMemberTier(userPoints);

  useEffect(() => {
    const user = localStorage.getItem("activeUser");
    if (user) setActiveUser(user);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Proses klaim reward
  const handleClaimReward = (reward) => {
    if (userPoints >= reward.cost) {
      setUserPoints((prev) => prev - reward.cost);
      setClaimedRewards((prev) => [...prev, reward.id]);
      const newHistory = {
        id: Date.now(),
        aktivitas: `Klaim: ${reward.title}`,
        tipe: "minus",
        jumlah: reward.cost,
        tanggal: "Hari ini",
      };
      setPointHistory((prev) => [newHistory, ...prev]);
      setCrmMessage(`🎉 Sukses menukarkan ${reward.cost} Pts untuk ${reward.title}!`);
      setTimeout(() => setCrmMessage(""), 4000);
    } else {
      alert("Maaf, saldo poin CRM Anda tidak mencukupi untuk mengklaim reward ini.");
    }
  };

  // Simulasi akumulasi poin saat beli produk
  const handleBuyProduct = (product) => {
    setUserPoints((prev) => prev + product.poin);
    const newHistory = {
      id: Date.now(),
      aktivitas: `Pembelian ${product.nama}`,
      tipe: "plus",
      jumlah: product.poin,
      tanggal: "Hari ini",
    };
    setPointHistory((prev) => [newHistory, ...prev]);
    setCrmMessage(`🛍️ Pembelian berhasil! +${product.poin} Pts ditambahkan ke akun CRM Anda.`);
    setTimeout(() => setCrmMessage(""), 4000);
  };

  const filteredProducts = memberProducts.filter((product) => {
    const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || product.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Semua", "Ruang Tamu", "Kamar Tidur", "Ruang Kerja", "Dapur", "Dekorasi"];

  return (
    <div className="font-poppins text-slate-800 bg-[#FAFAFA]">
      {/* ===== NAVBAR ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo — sama persis seperti Landing Page */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-200 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30 overflow-hidden">
              <img
                src={Logo}
                alt="FurniCraft Logo"
                className="w-full h-full object-cover p-1.5"
              />
            </div>
            <span
              className={`font-bold text-2xl transition-colors duration-300 ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              FurniCraft
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center space-x-5">
            <div
              className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                scrolled ? "text-slate-600" : "text-white/80"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  scrolled
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-white/10 text-white"
                }`}
              >
                <User size={16} />
              </div>
              <span className="font-semibold">{activeUser || "Member"}</span>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
                scrolled
                  ? "text-red-500 hover:text-red-600"
                  : "text-red-300 hover:text-red-400"
              }`}
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO CRM SECTION ===== */}
      <section className="relative pt-28 pb-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 overflow-hidden">
        {/* Decorative blur circles — sama seperti Landing Page Hero */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" />
        <div
          className="absolute bottom-10 -right-20 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* CRM Notification */}
          {crmMessage && (
            <div className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-5 py-3.5 rounded-2xl text-sm font-medium mb-8 shadow-sm animate-fade-in">
              {crmMessage}
            </div>
          )}

          {/* Welcome Heading */}
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-semibold text-amber-300 mb-4 shadow-lg">
              <Crown size={16} /> Dashboard Member
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Selamat Datang,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                {activeUser || "Member"}
              </span>{" "}
              ✨
            </h1>
            <p className="text-indigo-200 mt-3 text-lg max-w-xl mx-auto font-light leading-relaxed">
              Kelola poin loyalitas Anda dan nikmati berbagai keuntungan eksklusif hanya untuk member FurniCraft.
            </p>
          </ScrollReveal>

          {/* Three CRM Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card — Glass Morphism */}
            <ScrollReveal>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl h-full flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300 font-medium">Selamat Datang,</p>
                    <h2 className="text-xl font-bold text-white leading-snug">
                      {activeUser || "Member FurniCraft"}
                    </h2>
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle size={12} /> Terverifikasi
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-indigo-300 flex justify-between">
                  <span>Status Akun:</span>
                  <span className="font-semibold text-white">Loyalty Active</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Points Wallet — Gradient Card seperti Landing Page Member Section */}
            <ScrollReveal delay={100}>
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden h-full flex flex-col justify-between">
                <div className="absolute -right-6 -bottom-6 text-white/10 pointer-events-none">
                  <Award size={140} />
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-xs text-indigo-200 font-medium tracking-wide uppercase">
                      Saldo Poin CRM
                    </p>
                    <h3 className="text-3xl font-extrabold mt-1">
                      {userPoints.toLocaleString()}{" "}
                      <span className="text-sm font-normal text-indigo-200">Pts</span>
                    </h3>
                  </div>
                  <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                    <Star className="fill-amber-300 text-amber-300" size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20 text-xs text-indigo-200 relative z-10">
                  <p>Gunakan poin Anda untuk mengklaim keuntungan di katalog benefit.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Tier Card — Glass Morphism */}
            <ScrollReveal delay={200}>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-indigo-300 font-medium">Level Loyalitas</p>
                    <h4 className="text-lg font-bold text-amber-300 mt-0.5">{currentTier.name}</h4>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl flex items-center justify-center font-bold shadow-sm text-xl">
                    {currentTier.icon}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500 ${currentTier.bar}`}
                    />
                  </div>
                  {currentTier.next > 0 ? (
                    <p className="text-[11px] text-indigo-300 mt-2.5">
                      Dapatkan <strong className="text-white">{currentTier.next} Pts</strong> lagi untuk naik tingkat.
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-300 font-medium mt-2.5">
                      Anda berada di level tertinggi 🎉
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== CRM REWARDS & HISTORY ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reward Catalog */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal>
              <div>
                <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
                  Benefit Eksklusif
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-3">
                  <Gift size={24} className="text-indigo-600" /> Tukar Benefit Reward CRM
                </h3>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {crmRewards.map((reward, idx) => {
                const isClaimed = claimedRewards.includes(reward.id);
                return (
                  <ScrollReveal key={reward.id} delay={idx * 100}>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                      {/* Decorative circle — sama seperti Landing Page */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold text-xs px-3 py-1 border border-amber-200 rounded-full">
                          <Ticket size={12} /> {reward.cost} Pts
                        </span>
                        <h4 className="font-bold text-slate-900 mt-3 text-lg">{reward.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{reward.deskripsi}</p>
                      </div>
                      <div className="mt-5 relative z-10">
                        <button
                          onClick={() => handleClaimReward(reward)}
                          disabled={isClaimed}
                          className={`w-full text-center py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                            isClaimed
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02]"
                          }`}
                        >
                          {isClaimed ? "✓ Sudah Diklaim" : "Tukarkan Poin"}
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Point History */}
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Clock size={18} className="text-indigo-600" /> Log Riwayat Poin
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
                {pointHistory.map((log) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center text-sm pb-3 border-b border-slate-50 last:border-none"
                  >
                    <div>
                      <p className="font-semibold text-slate-700">{log.aktivitas}</p>
                      <span className="text-xs text-slate-400">{log.tanggal}</span>
                    </div>
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                        log.tipe === "plus"
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-rose-600 bg-rose-50"
                      }`}
                    >
                      {log.tipe === "plus" ? `+${log.jumlah}` : `-${log.jumlah}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PRODUCT SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header — sama seperti Landing Page */}
          <ScrollReveal className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              Penawaran Khusus
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Produk Eksklusif Member
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Belanja dan kumpulkan poin CRM untuk benefit lebih banyak
            </p>
          </ScrollReveal>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-12">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari furniture impian Anda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition placeholder:text-slate-400 shadow-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-semibold ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30"
                      : "border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid — kartu sama persis seperti Landing Page */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 shadow-sm">
              Produk yang Anda cari tidak ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 100}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col group">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.gambar}
                        alt={product.nama}
                        className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                        onError={handleImageError}
                      />
                      {product.badge && (
                        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          {product.badge}
                        </span>
                      )}
                      {/* Points Badge */}
                      <span className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white font-medium text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Star className="fill-amber-400 text-amber-400" size={12} /> +{product.poin} Poin
                      </span>
                      {/* Hover Actions — sama seperti Landing Page */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white shadow-md transition">
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                        {product.kategori}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition">
                        {product.nama}
                      </h3>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium leading-none">
                            Harga Member
                          </p>
                          <p className="font-extrabold text-lg text-slate-900 mt-1">
                            Rp {product.harga.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <button
                          onClick={() => handleBuyProduct(product)}
                          className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER MINI ===== */}
      <footer className="bg-slate-950 text-slate-400 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="font-bold text-2xl text-white">FurniCraft</span>
            </Link>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} FurniCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}