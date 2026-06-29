import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaWarehouse, FaMoneyBillWave, FaTag, FaPercentage, FaCrown } from "react-icons/fa";
import { authAPI } from "../services/authAPI";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userTier, setUserTier] = useState("Bronze");

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const data = await authAPI.getProductById(id);
                setProduct(data);
                
                const currentUser = await authAPI.getCurrentUser();
                if (currentUser) {
                    setUserTier(currentUser.tier || "Bronze");
                }
            } catch (err) {
                console.error("Gagal memuat detail produk:", err);
                setError("Produk tidak ditemukan atau gagal terhubung ke server Supabase.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center font-bold text-amber-800 animate-pulse">Memuat detail furnitur dari Supabase...</div>;
    }

    if (error || !product) {
        return (
            <div className="p-10 text-center max-w-md mx-auto mt-12 bg-white rounded-3xl border border-stone-100 shadow-sm">
                <p className="text-red-500 font-bold text-lg">Produk Tidak Ditemukan</p>
                <p className="text-stone-400 text-xs mt-1 mb-6">{error || `Furnitur dengan ID #${id} tidak tersedia dalam katalog kami.`}</p>
                <button onClick={() => navigate('/products')} className="px-6 py-2.5 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-amber-800 transition-all">
                    Kembali ke Koleksi
                </button>
            </div>
        );
    }

    const appliedPromo = parseInt(localStorage.getItem("appliedPromo") || "0");
    const discountRate = authAPI.getTierDiscountRate(userTier) + (appliedPromo / 100);
    const originalPrice = product.price || 0;
    const discountedPrice = Math.round(originalPrice * (1 - discountRate));

    return (
        <div className="p-6 animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto">
            {/* Tombol Kembali Navigasi */}
            <button 
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-stone-500 hover:text-amber-800 font-bold mb-6 transition-colors text-sm"
            >
                <FaArrowLeft className="text-xs" /> Kembali ke Katalog
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-8 lg:p-10 rounded-[40px] shadow-sm border border-stone-100">
                {/* Kolom Kiri: Gambar Produk */}
                <div className="relative group">
                    <img 
                        src={product.thumbnail || "https://placehold.co/600x400?text=Produk+Furnitur"} 
                        alt={product.title} 
                        className="w-full h-[380px] lg:h-[450px] object-cover rounded-[32px] shadow-inner border border-stone-50"
                    />
                    <div className="absolute top-4 left-4 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <FaTag className="text-amber-400 text-[10px]" /> {product.code || "LW-000"}
                    </div>
                    <div className="absolute top-4 right-4 bg-amber-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        Premium Wood
                    </div>
                </div>

                {/* Kolom Kanan: Informasi Produk & Special Tier Discount Banner */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-700 font-black uppercase tracking-widest text-[10px] bg-amber-50 px-3 py-1 rounded-full">
                                {product.category || "General"}
                            </span>
                            <span className="text-stone-400 text-xs font-bold">•</span>
                            <span className="text-stone-500 text-xs font-bold">{product.brand || "LuxWood"}</span>
                        </div>
                        
                        <h1 className="text-3xl lg:text-4xl font-black text-stone-800 mb-4 leading-tight">
                            {product.title}
                        </h1>
                        
                        <p className="text-stone-500 text-sm leading-relaxed mb-6 border-b border-stone-50 pb-6">
                            {product.description || "Tidak ada deskripsi produk."}
                        </p>

                        {/* Banner Diskon Tier Member (PRD 3) */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                                    <FaCrown className="text-lg" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">Spesial Diskon Member</span>
                                    <p className="text-xs font-bold text-stone-800">
                                        Level Tier Anda: <span className="text-amber-900 font-extrabold">{userTier}</span> (Hemat {(discountRate * 100)}%)
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-black bg-amber-800 text-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                                <FaPercentage className="text-[10px]" /> -{(discountRate * 100)}%
                            </span>
                        </div>

                        {/* Kotak Informasi Stok & Harga */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Stok Gudang</p>
                                <p className="text-lg font-bold text-stone-800 flex items-center gap-2">
                                    <FaWarehouse className="text-amber-700 text-sm" /> 
                                    <span>{product.stock || 0} Unit</span>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full ml-auto ${product.stock > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                        {product.stock > 0 ? 'Tersedia' : 'Habis'}
                                    </span>
                                </p>
                            </div>
                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Harga Member ({userTier})</p>
                                <div>
                                    <span className="text-xs text-stone-400 line-through block leading-none">Rp {originalPrice.toLocaleString('id-ID')}</span>
                                    <p className="text-lg font-black text-amber-900 flex items-center gap-1.5 mt-0.5">
                                        <FaMoneyBillWave className="text-emerald-600 text-sm shrink-0" /> 
                                        <span className="truncate">Rp {discountedPrice.toLocaleString('id-ID')}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}