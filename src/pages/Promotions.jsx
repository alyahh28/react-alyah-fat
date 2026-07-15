import { useState, useEffect } from "react";
import { MdLocalOffer, MdFlashOn, MdMessage, MdAdd } from "react-icons/md";
import { authAPI } from "../services/authAPI";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export default function Promotions() {
    const [activeTab, setActiveTab] = useState("promo");

    const [promoCodes, setPromoCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ code: "", discount_percent: 10 });

    const fetchPromos = async () => {
        setIsLoading(true);
        try {
            const data = await authAPI.getAllPromoCodes();
            setPromoCodes(data);
        } catch (e) {
            console.error("Gagal mengambil promo:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "promo") {
            fetchPromos();
        }
    }, [activeTab]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.code) return;
        setIsSubmitting(true);
        try {
            await authAPI.createPromoCode(formData);
            setIsAddOpen(false);
            setFormData({ code: "", discount_percent: 10 });
            fetchPromos();
        } catch (e) {
            alert("Gagal membuat promo: " + e.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const [flashSales, setFlashSales] = useState([
        { id: 1, name: "Year End Sale", discount: "Up to 50%", startTime: "2026-12-25 00:00", endTime: "2026-12-31 23:59", status: "Scheduled" }
    ]);

    return (
        <div className="p-8 w-full font-poppins bg-slate-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <MdLocalOffer className="text-[#22285E]" /> Marketing & Promotions
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Kelola kode promo, flash sale, dan pengumuman massal ke pelanggan.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab("promo")}
                    className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === "promo" ? "border-[#22285E] text-[#22285E]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <MdLocalOffer className="inline mr-2" /> Promo Codes
                </button>
                <button 
                    onClick={() => setActiveTab("flash")}
                    className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === "flash" ? "border-[#22285E] text-[#22285E]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <MdFlashOn className="inline mr-2" /> Flash Sales
                </button>
                <button 
                    onClick={() => setActiveTab("broadcast")}
                    className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === "broadcast" ? "border-[#22285E] text-[#22285E]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <MdMessage className="inline mr-2" /> Broadcast Notifications
                </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                {activeTab === "promo" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-lg text-slate-800">Daftar Kode Promo</h2>
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <button className="flex items-center gap-2 bg-[#22285E] hover:bg-[#1a1e4a] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                                        <MdAdd /> Buat Promo
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="bg-white rounded-[24px] p-6 max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-bold">Buat Promo Baru</DialogTitle>
                                        <DialogDescription className="text-xs text-slate-500">Masukkan kode unik dan persentase diskon.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 block mb-1">Kode Promo</label>
                                            <input 
                                                type="text" 
                                                value={formData.code} 
                                                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                                placeholder="Cth: TAHUNBARU" 
                                                className="w-full p-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22285E]" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 block mb-1">Diskon (%)</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="100"
                                                value={formData.discount_percent} 
                                                onChange={(e) => setFormData({...formData, discount_percent: e.target.value})}
                                                className="w-full p-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22285E]" 
                                                required 
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200">Batal</button>
                                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#22285E] text-white text-xs font-bold rounded-xl hover:bg-[#1a1e4a]">
                                                {isSubmitting ? "Menyimpan..." : "Simpan"}
                                            </button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="py-3 px-4 rounded-l-xl">Kode</th>
                                    <th className="py-3 px-4">Diskon</th>
                                    <th className="py-3 px-4">Berlaku Hingga</th>
                                    <th className="py-3 px-4 rounded-r-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">Memuat data...</td>
                                    </tr>
                                ) : promoCodes.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">Belum ada promo yang dibuat.</td>
                                    </tr>
                                ) : promoCodes.map(promo => (
                                    <tr key={promo.id}>
                                        <td className="py-3 px-4 font-bold text-slate-800">{promo.code}</td>
                                        <td className="py-3 px-4 font-bold text-green-600">{promo.discount_percent}%</td>
                                        <td className="py-3 px-4 text-slate-600">-</td>
                                        <td className="py-3 px-4">
                                            {promo.used ? (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">Terpakai</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Aktif</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "flash" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-lg text-slate-800">Jadwal Flash Sale</h2>
                            <button className="flex items-center gap-2 bg-[#22285E] hover:bg-[#1a1e4a] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                                <MdAdd /> Jadwalkan
                            </button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="py-3 px-4 rounded-l-xl">Nama Event</th>
                                    <th className="py-3 px-4">Diskon Produk</th>
                                    <th className="py-3 px-4">Waktu Mulai</th>
                                    <th className="py-3 px-4 rounded-r-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {flashSales.map(fs => (
                                    <tr key={fs.id}>
                                        <td className="py-3 px-4 font-bold text-slate-800">{fs.name}</td>
                                        <td className="py-3 px-4 font-bold text-red-500">{fs.discount}</td>
                                        <td className="py-3 px-4 text-slate-600">{fs.startTime}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">{fs.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "broadcast" && (
                    <div className="max-w-2xl">
                        <h2 className="font-bold text-lg text-slate-800 mb-6">Kirim Notifikasi Massal</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Broadcast berhasil dikirim!"); }}>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Penerima</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22285E]">
                                    <option>Semua Member</option>
                                    <option>Hanya Member Platinum</option>
                                    <option>Member Inactive (30 hari)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Pesan Notifikasi</label>
                                <textarea 
                                    rows="4" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22285E]"
                                    placeholder="Tuliskan pesan promosi Anda di sini..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all mt-4">
                                Kirim Pesan Sekarang
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
