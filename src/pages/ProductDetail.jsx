import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaWarehouse, FaMoneyBillWave, FaTag, FaCheckCircle } from "react-icons/fa";
// 1. Import data JSON lokal
import productsData from "../data/products.json";

export default function ProductDetail() {
    // Mengambil nilai ID dinamis dari rute URL (contoh: /products/1 -> id bernilai "1")
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi pencarian data dari file JSON lokal berdasarkan ID
        // Parameter id dari URL bertipe String, jadi gunakan parseInt() agar cocok dengan Number di JSON
        const foundProduct = productsData.find((item) => item.id === parseInt(id));
        
        if (foundProduct) {
            setProduct(foundProduct);
        }
        
        // Selesai memuat
        setLoading(false);
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center font-bold text-stone-400 animate-pulse">Memuat detail furnitur...</div>;
    }

    if (!product) {
        return (
            <div className="p-10 text-center max-w-md mx-auto mt-12 bg-white rounded-3xl border border-stone-100 shadow-sm">
                <p className="text-red-500 font-bold text-lg">Produk Tidak Ditemukan</p>
                <p className="text-stone-400 text-xs mt-1 mb-6">Furnitur dengan ID #{id} tidak tersedia dalam katalog kami.</p>
                <button onClick={() => navigate('/products')} className="px-6 py-2.5 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-amber-800 transition-all">
                    Kembali ke Koleksi
                </button>
            </div>
        );
    }

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
                        src={product.thumbnail} 
                        alt={product.title} 
                        className="w-full h-[380px] lg:h-[450px] object-cover rounded-[32px] shadow-inner border border-stone-50"
                    />
                    <div className="absolute top-4 left-4 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <FaTag className="text-amber-400 text-[10px]" /> {product.code}
                    </div>
                    <div className="absolute top-4 right-4 bg-amber-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        Premium Wood
                    </div>
                </div>

                {/* Kolom Kanan: Informasi Produk */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-700 font-black uppercase tracking-widest text-[10px] bg-amber-50 px-3 py-1 rounded-full">
                                {product.category}
                            </span>
                            <span className="text-stone-400 text-xs font-bold">•</span>
                            <span className="text-stone-500 text-xs font-bold">{product.brand}</span>
                        </div>
                        
                        <h1 className="text-3xl lg:text-4xl font-black text-stone-800 mb-4 leading-tight">
                            {product.title}
                        </h1>
                        
                        <p className="text-stone-500 text-sm leading-relaxed mb-8 border-b border-stone-50 pb-6">
                            {product.description}
                        </p>

                        {/* Kotak Informasi Stok & Harga */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Stok Gudang</p>
                                <p className="text-lg font-bold text-stone-800 flex items-center gap-2">
                                    <FaWarehouse className="text-amber-700 text-sm" /> 
                                    <span>{product.stock} Unit</span>
                                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">Tersedia</span>
                                </p>
                            </div>
                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Harga Satuan</p>
                                <p className="text-lg font-black text-amber-900 flex items-center gap-1.5">
                                    <FaMoneyBillWave className="text-emerald-600 text-sm shrink-0" /> 
                                    <span className="truncate">Rp {product.price.toLocaleString('id-ID')}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-3 mt-auto">
                        <button className="flex-1 bg-stone-900 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-2">
                            <FaCheckCircle className="text-amber-400" /> Proses Pesanan Produk
                        </button>
                        <button className="px-5 bg-stone-50 border border-stone-200 text-stone-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}