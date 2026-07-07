import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import productsData from "../data/products.json";
import { authAPI } from "../services/authAPI";
import { useCart } from "../context/CartContext";
import { FaPlus, FaEdit, FaTrash, FaDatabase } from "react-icons/fa";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

export default function Courses({ isGuest = false }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        code: "",
        category: "",
        brand: "",
        price: 0,
        stock: 0,
        thumbnail: "",
        description: ""
    });

    const userRole = (localStorage.getItem("userRole") || "").toLowerCase();
    const isAdmin = userRole === "admin" && !isGuest;
    const { addToCart, setIsCartOpen } = useCart();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await authAPI.getAllProducts();
            if (data && data.length > 0) {
                setProducts(data);
            } else {
                setProducts(productsData.slice(0, 10)); // Use dummy data as fallback
            }
        } catch (err) {
            console.error("Gagal memuat produk:", err);
            setProducts(productsData.slice(0, 10)); // Use dummy data on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSeedData = async () => {
        if (!window.confirm("Upload data awal produk dari products.json ke Supabase?")) return;
        setLoading(true);
        try {
            await authAPI.seedProducts(productsData);
            await fetchProducts();
        } catch (err) {
            console.error("Error seeding products:", err);
            alert("Gagal melakukan seed data: " + err.message);
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? parseInt(value) || 0 : value
        }));
    };

    const handleAddOpen = () => {
        setFormData({
            title: "",
            code: `LW-${Math.floor(100 + Math.random() * 900)}`,
            category: "Living Room",
            brand: "LuxWood",
            price: 1000000,
            stock: 10,
            thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            description: ""
        });
        setIsAddOpen(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await authAPI.addProduct(formData);
            setIsAddOpen(false);
            fetchProducts();
        } catch (err) {
            console.error("Error adding product:", err);
            alert("Gagal menambahkan produk: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditOpen = (p) => {
        setSelectedProduct(p);
        setFormData({
            title: p.title || "",
            code: p.code || "",
            category: p.category || "",
            brand: p.brand || "",
            price: p.price || 0,
            stock: p.stock || 0,
            thumbnail: p.thumbnail || "",
            description: p.description || ""
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;
        setIsSubmitting(true);
        try {
            await authAPI.updateProduct(selectedProduct.id, formData);
            setIsEditOpen(false);
            setSelectedProduct(null);
            fetchProducts();
        } catch (err) {
            console.error("Error updating product:", err);
            alert("Gagal memperbarui produk: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini dari database?")) return;
        try {
            await authAPI.deleteProduct(id);
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Gagal menghapus produk: " + err.message);
        }
    };

    return (
        <div className="p-4 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <PageHeader title="Product Collection" />
                
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        {products.length === 0 && (
                            <button 
                                onClick={handleSeedData}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                                <FaDatabase /> Seed Data Awal
                            </button>
                        )}
                        <button 
                            onClick={handleAddOpen}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#9E4BDC] hover:bg-[#8A3BCA] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#9E4BDC]/30"
                        >
                            <FaPlus /> Tambah Produk
                        </button>
                    </div>
                )}
            </div>
            
            {/* Modal Tambah Produk */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="bg-white rounded-[24px] p-6 max-w-lg border border-stone-100 shadow-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-stone-800">Tambah Produk Furnitur Baru</DialogTitle>
                        <DialogDescription className="text-stone-400 text-xs mt-1">Masukkan rincian produk baru ke katalog Supabase.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-xs">
                        <div>
                            <label className="font-bold text-stone-700 block mb-1">Nama Produk</label>
                            <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" placeholder="Contoh: Meja Jati Premium" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Kode Produk</label>
                                <input type="text" name="code" value={formData.code} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                            </div>
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Kategori</label>
                                <input type="text" name="category" value={formData.category} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" placeholder="Dining, Bedroom, etc" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Harga (Rp)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                            </div>
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Stok Gudang</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                            </div>
                        </div>
                        <div>
                            <label className="font-bold text-stone-700 block mb-1">URL Gambar (Thumbnail)</label>
                            <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="font-bold text-stone-700 block mb-1">Deskripsi Produk</label>
                            <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" placeholder="Deskripsi lengkap mengenai bahan dan spesifikasi..." />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Batal</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#9E4BDC] text-white font-bold rounded-xl hover:bg-[#8A3BCA]">
                                {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Produk */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-[24px] p-6 max-w-lg border border-stone-100 shadow-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-stone-800">Edit Produk Furnitur</DialogTitle>
                        <DialogDescription className="text-stone-400 text-xs mt-1">Perbarui informasi produk di katalog Supabase.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-3 mt-4 text-xs">
                        <div>
                            <label className="font-bold text-stone-700 block mb-1">Nama Produk</label>
                            <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Kode Produk</label>
                                <input type="text" name="code" value={formData.code} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                            </div>
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Kategori</label>
                                <input type="text" name="category" value={formData.category} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Harga (Rp)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                            </div>
                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Stok Gudang</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                            </div>
                        </div>
                        <div>
                            <label className="font-bold text-stone-700 block mb-1">URL Gambar (Thumbnail)</label>
                            <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleFormChange} required className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                        </div>
                        <div>
                            <label className="font-bold text-stone-700 block mb-1">Deskripsi Produk</label>
                            <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" className="w-full p-2.5 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-700" />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Batal</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#9E4BDC] text-white font-bold rounded-xl hover:bg-[#8A3BCA]">
                                {isSubmitting ? "Memperbarui..." : "Perbarui Produk"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {loading ? (
                <div className="p-20 text-center font-bold text-[#9E4BDC] animate-pulse text-sm">
                    🔄 Memuat katalog produk dari Supabase...
                </div>
            ) : products.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm mt-6">
                    <p className="text-slate-600 font-bold text-base mb-2">Belum Ada Produk di Database</p>
                    <p className="text-slate-400 text-xs mb-6">Klik tombol "Seed Data Awal" di atas untuk mengunggah sampel produk secara otomatis.</p>
                    {isAdmin && (
                        <button onClick={handleSeedData} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md">
                            Upload Sample Data Produk
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {products.map((p) => (
                        <div key={p.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                            <div className="relative overflow-hidden">
                                <img 
                                    src={p.thumbnail || "https://placehold.co/600x400?text=Produk+Furnitur"} 
                                    alt={p.title} 
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                    {p.category}
                                </span>

                                {isAdmin && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md">
                                        <button onClick={() => handleEditOpen(p)} className="p-1.5 text-slate-600 hover:text-[#9E4BDC] transition-colors" title="Edit Produk">
                                            <FaEdit className="text-xs" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-stone-600 hover:text-red-600 transition-colors" title="Hapus Produk">
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <Link to={`/products/${p.id}`}>
                                        <h4 className="font-bold text-slate-800 text-lg hover:text-[#9E4BDC] transition-colors cursor-pointer line-clamp-1">
                                            {p.title}
                                        </h4>
                                    </Link>
                                    
                                    <p className="text-[#9E4BDC] font-bold mt-1">
                                        Rp {(p.price || 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                
                                <div className="flex justify-between items-center mt-6 text-xs text-stone-400 border-t border-stone-50 pt-4">
                                    <span className="bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                                        Stock: <span className="text-stone-800 font-bold">{p.stock}</span>
                                    </span>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => { addToCart(p); setIsCartOpen(true); }}
                                            className="bg-indigo-600 text-white px-3 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm text-[11px]"
                                        >
                                            + Keranjang
                                        </button>
                                        <Link 
                                            to={`/products/${p.id}`} 
                                            className="bg-slate-900 text-white px-3 py-2 rounded-xl font-bold hover:bg-[#9E4BDC] transition-all shadow-sm text-[11px]"
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}