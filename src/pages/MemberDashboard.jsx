import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { authAPI } from "../services/authAPI";
import { useCart } from "../context/CartContext";
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
  ShoppingCart,
  Crown,
  PackageCheck,
  MapPin,
  X,
  Percent
} from "lucide-react";

/* ===================== DATA REWARD CRM ===================== */
const crmRewards = [
  { id: "R1", title: "Potongan Langsung Rp 50.000", cost: 200, deskripsi: "Tanpa minimum transaksi" },
  { id: "R2", title: "Gratis Ongkir se-Jawa & Bali", cost: 350, deskripsi: "Maksimal subsidi Rp 150.000" },
  { id: "R3", title: "Voucher Cashback FurnitureQ 10%", cost: 500, deskripsi: "Hingga maksimal Rp 300.000" },
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

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { addToCart, setIsCartOpen } = useCart();
  
  // --- LOYALTY FASE 1 & 4 STATES ---
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileData, setProfileData] = useState({ address: '', dob: '' });
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [referralCopied, setReferralCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [scrolled, setScrolled] = useState(false);

  // --- SUPABASE DATA STATES ---
  const [dbProducts, setDbProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [pointLogs, setPointLogs] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // --- USER LOYALTY STATE ---
  const [userPoints, setUserPoints] = useState(0);
  const [userTier, setUserTier] = useState("Bronze");

  // --- ORDER MODAL STATE ---
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const [claimedRewards, setClaimedRewards] = useState([]);
  const [crmMessage, setCrmMessage] = useState("");

  // Kalkulasi Tier Progress sesuai PRD 3
  const getTierProgressInfo = (points) => {
    if (points >= 7000) {
      return { name: "Platinum", bar: "w-full", next: 0, icon: "💎", discountText: "Diskon 20%", max: true };
    }
    if (points >= 3000) {
      const pct = Math.min(100, Math.floor(((points - 3000) / 4000) * 100));
      return { name: "Gold", bar: `w-[${pct}%]`, next: 7000 - points, icon: "👑", discountText: "Diskon 15%", max: false };
    }
    if (points >= 1000) {
      const pct = Math.min(100, Math.floor(((points - 1000) / 2000) * 100));
      return { name: "Silver", bar: `w-[${pct}%]`, next: 3000 - points, icon: "🥈", discountText: "Diskon 10%", max: false };
    }
    const pct = Math.min(100, Math.floor((points / 1000) * 100));
    return { name: "Bronze", bar: `w-[${pct}%]`, next: 1000 - points, icon: "🥉", discountText: "Diskon 5%", max: false };
  };

  const currentTierInfo = getTierProgressInfo(userPoints);
  const appliedPromo = parseInt(localStorage.getItem("appliedPromo") || "0");
  const discountRate = authAPI.getTierDiscountRate(userTier) + (appliedPromo / 100);

  const loadMemberData = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setActiveUser(user.fullname);
        const pts = user.points || 0;
        const tr = user.tier || authAPI.calculateTier(pts);
        setUserPoints(pts);
        setUserTier(tr);
        
        // Fase 1: Welcome Bonus
        const claimed = await authAPI.claimWelcomeBonus(user.id);
        if (claimed) {
            setCrmMessage("Selamat datang! Anda mendapatkan +10 Poin pendaftaran.");
            setUserPoints(prev => prev + 10);
        }

        // Tampilkan onboarding jika belum lengkap
        if (!user.profile?.address || !user.profile?.dob) {
            const extProfile = JSON.parse(localStorage.getItem(`user_profile_ext_${user.id}`) || "{}");
            if (!user.profile?.address && !extProfile.address) {
                setShowOnboarding(true);
            }
        }

        fetchUserOrders(user.id);
        fetchPointHistory(user.id);
      }
    } catch (err) {
      console.error("Gagal memuat sesi member:", err);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    let prods = [];
    try {
      prods = await authAPI.getAllProducts();
    } catch (err) {
      console.error("Gagal memuat produk member, menggunakan dummy data:", err);
    } finally {
      // JIKA DATA KOSONG ATAU ERROR, GUNAKAN DUMMY DATA (50 PRODUK, 10 PER KATEGORI)
      if (!prods || prods.length === 0) {
          prods = [
            // ===== LIVING ROOM (10 produk) =====
            { id: "d-lr-1",  title: "Sofa Minimalis 3 Seater",     category: "Living Room", brand: "LuxWood",    price: 2500000, thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-2",  title: "Sofa L-Shape Premium",         category: "Living Room", brand: "FurnitureQ", price: 4800000, thumbnail: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-3",  title: "Kursi Santai Rotan Estetik",   category: "Living Room", brand: "RotanArt",   price: 1500000, thumbnail: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-4",  title: "Meja Kopi Kayu Solid",         category: "Living Room", brand: "LuxWood",    price: 1800000, thumbnail: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-5",  title: "Rak TV Kayu Walnut",           category: "Living Room", brand: "FurnitureQ", price: 2100000, thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-6",  title: "Sofa 2 Seater Scandinavian",   category: "Living Room", brand: "NordicHome", price: 2900000, thumbnail: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-7",  title: "Meja Samping Kayu Jati",       category: "Living Room", brand: "LuxWood",    price: 750000,  thumbnail: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-8",  title: "Pouf Rajut Dekoratif",         category: "Living Room", brand: "RotanArt",   price: 480000,  thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-9",  title: "Rak Buku Minimalis 5 Tingkat", category: "Living Room", brand: "FurnitureQ", price: 1350000, thumbnail: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=400&q=80" },
            { id: "d-lr-10", title: "Karpet Geometrik Premium",      category: "Living Room", brand: "NordicHome", price: 950000,  thumbnail: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&q=80" },

            // ===== BEDROOM (10 produk) =====
            { id: "d-bd-1",  title: "Tempat Tidur Queen Size",       category: "Bedroom", brand: "LuxWood",    price: 4500000, thumbnail: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-2",  title: "Lemari Pakaian 3 Pintu",        category: "Bedroom", brand: "FurnitureQ", price: 3800000, thumbnail: "https://images.unsplash.com/photo-1595526114101-729f27027b47?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-3",  title: "Nakas Minimalis Modern",         category: "Bedroom", brand: "NordicHome", price: 650000,  thumbnail: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-4",  title: "Meja Rias dengan Cermin",        category: "Bedroom", brand: "LuxWood",    price: 2200000, thumbnail: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa1e?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-5",  title: "Lemari 2 Pintu Sliding",         category: "Bedroom", brand: "FurnitureQ", price: 2700000, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-6",  title: "Headboard Berlapis Kain",        category: "Bedroom", brand: "NordicHome", price: 1100000, thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-7",  title: "Tempat Tidur King Size Kayu",    category: "Bedroom", brand: "LuxWood",    price: 6500000, thumbnail: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-8",  title: "Rak Buku Samping Tempat Tidur",  category: "Bedroom", brand: "RotanArt",   price: 580000,  thumbnail: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-9",  title: "Kabinet Penyimpanan 4 Laci",     category: "Bedroom", brand: "FurnitureQ", price: 1450000, thumbnail: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=400&q=80" },
            { id: "d-bd-10", title: "Cermin Berdiri Full-Length",     category: "Bedroom", brand: "NordicHome", price: 890000,  thumbnail: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80" },

            // ===== DINING (10 produk) =====
            { id: "d-dn-1",  title: "Meja Makan Kayu Jati 6 Kursi",  category: "Dining", brand: "FurnitureQ", price: 6800000, thumbnail: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-2",  title: "Set Kursi Makan Rotan (4 pcs)", category: "Dining", brand: "RotanArt",   price: 2400000, thumbnail: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-3",  title: "Meja Makan Bulat Marble",        category: "Dining", brand: "LuxWood",    price: 5200000, thumbnail: "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-4",  title: "Kursi Makan Scandinavian",       category: "Dining", brand: "NordicHome", price: 850000,  thumbnail: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-5",  title: "Bufet Kayu Vintage 3 Pintu",     category: "Dining", brand: "FurnitureQ", price: 3600000, thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-6",  title: "Kursi Bar Tinggi Minimalis",     category: "Dining", brand: "LuxWood",    price: 680000,  thumbnail: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-7",  title: "Meja Makan 4 Kursi Industrial",  category: "Dining", brand: "FurnitureQ", price: 4100000, thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-8",  title: "Rak Piring Kayu Tempel Dinding", category: "Dining", brand: "RotanArt",   price: 420000,  thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-9",  title: "Meja Lipat Multifungsi",         category: "Dining", brand: "NordicHome", price: 1200000, thumbnail: "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dn-10", title: "Set Meja Makan 2 Kursi Cafe",    category: "Dining", brand: "LuxWood",    price: 1750000, thumbnail: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=400&q=80" },

            // ===== OFFICE (10 produk) =====
            { id: "d-of-1",  title: "Meja Kerja Minimalis L-Shape",  category: "Office", brand: "NordicHome", price: 2800000, thumbnail: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-2",  title: "Kursi Ergonomis Executive",      category: "Office", brand: "ErgoPro",    price: 3500000, thumbnail: "https://images.unsplash.com/photo-1505409628601-edc9af17fda6?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-3",  title: "Rak Arsip Besi 5 Tingkat",       category: "Office", brand: "FurnitureQ", price: 1100000, thumbnail: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-4",  title: "Meja Kerja Standing Desk",       category: "Office", brand: "ErgoPro",    price: 4200000, thumbnail: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-5",  title: "Kursi Mesh Breathable",          category: "Office", brand: "NordicHome", price: 1800000, thumbnail: "https://images.unsplash.com/photo-1541558869434-2840d308329a?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-6",  title: "Kabinet Kunci Arsip 4 Laci",     category: "Office", brand: "FurnitureQ", price: 2300000, thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-7",  title: "Meja Komputer Sederhana",        category: "Office", brand: "NordicHome", price: 980000,  thumbnail: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-8",  title: "Partisi Kantor Kaca 120cm",      category: "Office", brand: "ErgoPro",    price: 1650000, thumbnail: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-9",  title: "Loker Karyawan 3 Pintu",         category: "Office", brand: "FurnitureQ", price: 2900000, thumbnail: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=400&q=80" },
            { id: "d-of-10", title: "Meja Meeting Oval 8 Kursi",      category: "Office", brand: "LuxWood",    price: 7500000, thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80" },

            // ===== DECOR (10 produk) =====
            { id: "d-dc-1",  title: "Pot Tanaman Keramik Putih",      category: "Decor", brand: "RotanArt",   price: 180000, thumbnail: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-2",  title: "Lampu Meja Arsitek Hitam",       category: "Decor", brand: "NordicHome", price: 450000, thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-3",  title: "Cermin Rotan Bulat 60cm",        category: "Decor", brand: "RotanArt",   price: 320000, thumbnail: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-4",  title: "Rak Dinding Hexagonal",          category: "Decor", brand: "NordicHome", price: 250000, thumbnail: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-5",  title: "Bantal Sofa Motif Bohemian",     category: "Decor", brand: "FurnitureQ", price: 120000, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-6",  title: "Vas Bunga Terraco Modern",       category: "Decor", brand: "RotanArt",   price: 95000,  thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-7",  title: "Lampu Gantung Rotan Boho",       category: "Decor", brand: "RotanArt",   price: 680000, thumbnail: "https://images.unsplash.com/photo-1513506003901-1e6a35073d57?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-8",  title: "Hiasan Dinding Makrame",         category: "Decor", brand: "NordicHome", price: 210000, thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-9",  title: "Set Lilin Aromaterapi",          category: "Decor", brand: "FurnitureQ", price: 75000,  thumbnail: "https://images.unsplash.com/photo-1602607144478-da69f3a96be7?auto=format&fit=crop&w=400&q=80" },
            { id: "d-dc-10", title: "Frame Foto Set 3 Ukuran",        category: "Decor", brand: "NordicHome", price: 145000, thumbnail: "https://images.unsplash.com/photo-1558865869-c93f6f8482af?auto=format&fit=crop&w=400&q=80" },
          ];
      }
      setDbProducts(prods);
      setLoadingProducts(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const orders = await authAPI.getUserOrders(userId);
      setMyOrders(orders);
    } catch (err) {
      console.error("Gagal memuat riwayat pesanan:", err);
    }
  };

  const fetchPointHistory = async (userId) => {
    try {
      const history = await authAPI.getPointHistory(userId);
      setPointLogs(history);
    } catch (err) {
      console.error("Gagal memuat history poin:", err);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("activeUser");
    if (userStr) setActiveUser(userStr);
    loadMemberData();
    fetchProducts();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDailyCheckin = async () => {
    if (!currentUser) return;
    const success = await authAPI.dailyCheckIn(currentUser.id);
    if (success) {
      setUserPoints(prev => prev + 2);
      setCrmMessage("Berhasil Check-in harian! +2 Poin");
      fetchPointHistory(currentUser.id);
    } else {
      setCrmMessage("Anda sudah check-in hari ini.");
    }
  };

  const handleShareProduct = async () => {
    if (!currentUser) return;
    const success = await authAPI.shareProduct(currentUser.id);
    if (success) {
      setUserPoints(prev => prev + 5);
      setCrmMessage("Terima kasih telah membagikan produk! +5 Poin");
      fetchPointHistory(currentUser.id);
    } else {
      setCrmMessage("Anda sudah klaim poin share hari ini.");
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`FURNI-${currentUser?.id?.substring(0,6).toUpperCase() || 'MEMBER'}`);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const handleCompleteProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.address || !profileData.dob) {
       alert("Lengkapi semua data!"); return;
    }
    const success = await authAPI.completeProfile(currentUser.id, profileData);
    if (success) {
       setUserPoints(prev => prev + 20);
       setCrmMessage("Profil lengkap! +20 Poin");
       fetchPointHistory(currentUser.id);
    }
    setShowOnboarding(false);
  };

  const handleOpenReview = (order) => {
    setReviewOrder(order);
    setReviewText("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const success = await authAPI.submitReview(currentUser.id, reviewOrder.id, 5, reviewText);
    if (success) {
      setUserPoints(prev => prev + 15);
      setCrmMessage("Terima kasih atas ulasan Anda! +15 Poin");
      fetchPointHistory(currentUser.id);
    } else {
      setCrmMessage("Pesanan ini sudah diulas.");
    }
    setReviewModalOpen(false);
  };

  const handleLogout = async () => {
    await authAPI.logoutUser();
    navigate("/");
  };

  const handleClaimReward = (reward) => {
    if (userPoints >= reward.cost) {
      setUserPoints((prev) => prev - reward.cost);
      setClaimedRewards((prev) => [...prev, reward.id]);
      setCrmMessage(`🎉 Sukses menukarkan ${reward.cost} Pts untuk ${reward.title}!`);
      setTimeout(() => setCrmMessage(""), 4000);
    } else {
      alert("Maaf, saldo poin CRM Anda tidak mencukupi untuk mengklaim reward ini.");
    }
  };

  const handleOpenOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
    setShippingAddress(currentUser?.profile?.address || "");
    setOrderModalOpen(true);
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !currentUser) {
      alert("Silakan login kembali untuk membuat pesanan.");
      return;
    }
    if (!shippingAddress.trim()) {
      alert("Silakan masukkan alamat pengiriman.");
      return;
    }

    setSubmittingOrder(true);
    try {
      const origPrice = selectedProduct.price || 0;
      const discountedUnitPrice = Math.round(origPrice * (1 - discountRate));
      const totalPrice = discountedUnitPrice * orderQuantity;

      const orderPayload = {
        user_id: currentUser.id,
        product_id: selectedProduct.id,
        quantity: orderQuantity,
        total_price: totalPrice,
        status: "pending",
        shipping_address: shippingAddress
      };

      await authAPI.createOrder(orderPayload);
      
      setCrmMessage(`🛍️ Pesanan berhasil dibuat dengan Diskon Tier ${(discountRate * 100)}%! Poin akan bertambah otomatis saat status pesanan menjadi COMPLETED.`);
      setTimeout(() => setCrmMessage(""), 6000);

      setOrderModalOpen(false);
      fetchUserOrders(currentUser.id);
    } catch (err) {
      console.error("Gagal membuat pesanan:", err);
      alert("Gagal membuat pesanan: " + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const filteredProducts = dbProducts.filter((product) => {
    const matchesSearch = (product.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Semua", "Living Room", "Bedroom", "Office", "Dining", "Decor"];

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
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-200 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30 overflow-hidden">
              <img
                src={Logo}
                alt="FurnitureQ Logo"
                className="w-full h-full object-cover p-1.5"
              />
            </div>
            <span
              className={`font-bold text-2xl transition-colors duration-300 ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              FurnitureQ
            </span>
          </Link>

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
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" />
        <div
          className="absolute bottom-10 -right-20 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {crmMessage && (
            <div className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-5 py-3.5 rounded-2xl text-sm font-medium mb-8 shadow-sm animate-fade-in">
              {crmMessage}
            </div>
          )}

          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-semibold text-amber-300 mb-4 shadow-lg">
              <Crown size={16} /> Loyalty Tier: {userTier} ({currentTierInfo.discountText})
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Selamat Datang,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                {activeUser || "Member"}
              </span>{" "}
              ✨
            </h1>
            <p className="text-indigo-200 mt-3 text-lg max-w-xl mx-auto font-light leading-relaxed">
              Nikmati diskon eksklusif <strong className="text-amber-300">{currentTierInfo.discountText}</strong> untuk setiap checkout belanja Anda!
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Misi Harian (Fase 2) */}
            <ScrollReveal>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-indigo-300 font-medium">Misi Harian & Referral</p>
                    <CheckCircle size={16} className="text-emerald-400" />
                  </div>
                  <div className="space-y-2.5">
                    <button onClick={handleDailyCheckin} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition group text-left">
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-amber-300 transition">Check-in Harian</p>
                        <p className="text-[10px] text-indigo-200 mt-0.5">Klaim bonus login tiap hari</p>
                      </div>
                      <span className="text-xs font-black bg-amber-500 text-white px-2 py-1 rounded-lg">+2 Pts</span>
                    </button>
                    <button onClick={handleShareProduct} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition group text-left">
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-amber-300 transition">Share ke Medsos</p>
                        <p className="text-[10px] text-indigo-200 mt-0.5">Bagikan katalog kami</p>
                      </div>
                      <span className="text-xs font-black bg-amber-500 text-white px-2 py-1 rounded-lg">+5 Pts</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] text-indigo-200 mb-1.5 font-medium">Ajak Teman (Referral Code)</p>
                  <button onClick={handleCopyReferral} className="w-full flex items-center justify-between bg-black/20 p-2.5 rounded-xl hover:bg-black/30 transition border border-white/5 text-left">
                    <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">FURNI-{activeUser?.substring(0,6).toUpperCase() || 'MEMBER'}</span>
                    <span className="text-[10px] text-indigo-300 font-semibold">{referralCopied ? 'Tersalin ✓' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Profile Card */}
            <ScrollReveal>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl h-full flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300 font-medium">Profil Member,</p>
                    <h2 className="text-xl font-bold text-white leading-snug">
                      {activeUser || "Member FurnitureQ"}
                    </h2>
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle size={12} /> Status: {userTier}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <span className="text-indigo-300">Hak Diskon Checkout: </span>
                    <span className="font-semibold text-amber-300">{currentTierInfo.discountText}</span>
                  </div>
                  <Link to="/member/profile" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition text-center">Lihat Profil & Riwayat</Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Saldo Poin */}
            <ScrollReveal delay={100}>
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden h-full flex flex-col justify-between">
                <div className="absolute -right-6 -bottom-6 text-white/10 pointer-events-none">
                  <Award size={140} />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-xs text-indigo-200 font-medium tracking-wide uppercase">
                      Akumulasi Poin Supabase
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
                  <p>Dapatkan 1 Poin per kelipatan transaksi Rp 1.000 saat pesanan diselesaikan (COMPLETED).</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Level Tier & Progress Bar (PRD 3) */}
            <ScrollReveal delay={200}>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-indigo-300 font-medium">Level Loyalitas Saat Ini</p>
                    <h4 className="text-xl font-black text-amber-300 mt-0.5">{userTier}</h4>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl flex items-center justify-center font-bold shadow-sm text-xl">
                    {currentTierInfo.icon}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-[11px] text-indigo-200 mb-1">
                    <span>Progress Tier</span>
                    <span>{userPoints} Pts</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          userPoints >= 7000 ? 100 :
                          userPoints >= 3000 ? Math.min(100, ((userPoints - 3000) / 4000) * 100) :
                          userPoints >= 1000 ? Math.min(100, ((userPoints - 1000) / 2000) * 100) :
                          Math.min(100, (userPoints / 1000) * 100)
                        }%`
                      }}
                    />
                  </div>
                  {!currentTierInfo.max ? (
                    <p className="text-[11px] text-indigo-300 mt-2.5">
                      Kumpulkan <strong className="text-white">{currentTierInfo.next.toLocaleString()} Pts</strong> lagi untuk naik ke tier berikutnya.
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-300 font-medium mt-2.5">
                      Selamat! Anda berada di tingkat tertinggi (Platinum) 👑
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== RIWAYAT PESANAN SAYA ===== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PackageCheck className="text-indigo-600" /> Riwayat Pesanan Saya
            </h3>

            {myOrders.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">
                Anda belum pernah membuat pesanan furnitur. Silakan pilih produk di bawah ini!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Produk</th>
                      <th className="py-3 px-4">Jumlah</th>
                      <th className="py-3 px-4">Total Bayar</th>
                      <th className="py-3 px-4">Alamat Pengiriman</th>
                      <th className="py-3 px-4">Status Pesanan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {myOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {ord.products?.title || "Produk Furnitur"}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {ord.quantity} Unit
                        </td>
                        <td className="py-3.5 px-4 font-bold text-indigo-900">
                          Rp {(ord.total_price || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate">
                          {ord.shipping_address || "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            ord.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            ord.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            ord.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {ord.status || 'pending'}
                          </span>
                          { (ord.status === 'shipped' || ord.status === 'completed') && !localStorage.getItem(`review_claimed_${ord.id}`) && (
                              <button onClick={() => handleOpenReview(ord)} className="mt-2 block w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold py-1 rounded-lg transition">Terima & Ulas (+15 Pts)</button>
                          )}
                          { localStorage.getItem(`review_claimed_${ord.id}`) && (
                              <span className="mt-2 block w-full text-center text-[10px] text-emerald-600 font-bold">✓ Diulas</span>
                          ) }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* ===== CRM REWARDS & POINT HISTORY ===== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          {/* Log Riwayat Poin Aktual (PRD 3) */}
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Clock size={18} className="text-indigo-600" /> Log Riwayat Poin (point_history)
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
                {pointLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Belum ada riwayat perolehan poin dari transaksi yang completed.</p>
                ) : (
                  pointLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex justify-between items-center text-sm pb-3 border-b border-slate-50 last:border-none"
                    >
                      <div>
                        <p className="font-semibold text-slate-700 text-xs">
                          {log.orders?.products?.title ? `Pesanan: ${log.orders.products.title}` : 'Bonus Perolehan Poin'}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <span className="font-bold px-2.5 py-1 rounded-full text-xs text-emerald-600 bg-emerald-50 shrink-0">
                        +{log.points_earned} Pts
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== KATALOG SUPABASE WITH TIER DISCOUNT PREVIEW ===== */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              Katalog Furnitur Supabase
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Produk Eksklusif Member
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Belanja dan manfaatkan potongan diskon <strong className="text-indigo-600">Tier {userTier} ({(discountRate * 100)}%)</strong>!
            </p>
          </ScrollReveal>

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

          {loadingProducts ? (
            <div className="text-center py-16 text-indigo-600 font-bold animate-pulse text-sm">
              🔄 Memuat produk dari database Supabase...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 shadow-sm">
              Belum ada produk furnitur yang cocok di database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => {
                const origPrice = product.price || 0;
                const discPrice = Math.round(origPrice * (1 - discountRate));

                return (
                  <ScrollReveal key={product.id} delay={index * 100}>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col group h-full">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.thumbnail || "https://placehold.co/400x300?text=Produk"}
                          alt={product.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                          onError={handleImageError}
                        />
                        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          {product.category || "Furnitur"}
                        </span>
                        <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Percent size={12} /> Tier {userTier} (-{(discountRate * 100)}%)
                        </span>
                      </div>
                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1 block">
                            {product.brand || "LuxWood"}
                          </span>
                          <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">
                            {product.title}
                          </h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium line-through">
                              Rp {origPrice.toLocaleString("id-ID")}
                            </p>
                            <p className="font-extrabold text-lg text-indigo-900 mt-0.5">
                              Rp {discPrice.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <button
                            onClick={() => { addToCart(product); setIsCartOpen(true); setCrmMessage(`🛒 ${product.title} ditambahkan ke keranjang!`); }}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-1.5"
                          >
                            <ShoppingCart size={14} /> Pesan
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== MODAL FORM PEMESANAN DENGAN DISKON TIER ===== */}
      {orderModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <ShoppingCart className="text-indigo-600" size={22} /> Form Pemesanan Furnitur
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Mendapatkan Potongan Diskon Member <strong className="text-amber-600">Tier {userTier} ({(discountRate * 100)}%)</strong>.
            </p>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                <img
                  src={selectedProduct.thumbnail || "https://placehold.co/100"}
                  alt={selectedProduct.title}
                  className="w-16 h-16 object-cover rounded-xl border border-indigo-100"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedProduct.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-400 line-through text-xs">Rp {(selectedProduct.price || 0).toLocaleString("id-ID")}</span>
                    <span className="text-indigo-600 font-extrabold text-sm">
                      Rp {Math.round((selectedProduct.price || 0) * (1 - discountRate)).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jumlah Pesanan (Quantity)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock || 100}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <MapPin size={14} className="text-indigo-600" /> Alamat Lengkap Pengiriman
                </label>
                <textarea
                  rows="3"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Masukkan jalan, RT/RW, Kecamatan, Kota, Kode Pos..."
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Total Pembayaran (Setelah Diskon):</span>
                  <span className="font-extrabold text-lg text-indigo-900">
                    Rp {(Math.round((selectedProduct.price || 0) * (1 - discountRate)) * orderQuantity).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition shadow-md"
                  >
                    {submittingOrder ? "Memproses..." : "Konfirmasi Pesanan"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== FOOTER MINI ===== */}
      <footer className="bg-slate-950 text-slate-400 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="font-bold text-2xl text-white">FurnitureQ</span>
            </Link>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} FurnitureQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== ONBOARDING MODAL ===== */}
      {showOnboarding && (
        <div id="onboarding-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center relative shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎉</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Selamat Datang di FurnitureQ!</h3>
            <p className="text-sm text-slate-500 mb-6">Lengkapi profil Anda (Alamat & Tanggal Lahir) sekarang untuk mendapatkan <strong className="text-amber-600">+20 Poin</strong> tambahan!</p>
            <form onSubmit={handleCompleteProfileSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
                <input type="date" required value={profileData.dob} onChange={e => setProfileData({...profileData, dob: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Pengiriman Utama</label>
                <textarea required rows="2" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500" placeholder="Jl. Merdeka No. 1..." />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowOnboarding(false)} className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">Nanti Saja</button>
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm">Simpan & Klaim Poin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== REVIEW MODAL ===== */}
      {reviewModalOpen && reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setReviewModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Konfirmasi & Ulasan</h3>
            <p className="text-xs text-slate-500 mb-4">Berikan ulasan untuk pesanan <strong>{reviewOrder.products?.title}</strong> dan dapatkan <strong className="text-emerald-600">+15 Poin</strong>!</p>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Ulasan Produk</label>
                <textarea required rows="3" value={reviewText} onChange={e => setReviewText(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500" placeholder="Kualitas kayu sangat bagus..." />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30">Kirim Ulasan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}