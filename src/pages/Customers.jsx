import { useState, useEffect, useRef } from "react";
import { 
  FaSearch, 
  FaUserPlus, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaHistory, 
  FaUserCheck, 
  FaUserCircle,
  FaEdit,
  FaTrash,
  FaPhone
} from "react-icons/fa";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

import { authAPI } from "../services/authAPI";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Dialog state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        address: ""
    });

    const inputNamaRef = useRef(null);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const data = await authAPI.getAllCustomers();
            setCustomers(data || []);
        } catch (err) {
            console.error("Gagal mengambil data pelanggan:", err);
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await authAPI.addCustomer(formData);
            setFormData({ fullname: "", email: "", phone: "", address: "" });
            setIsAddOpen(false);
            fetchCustomers();
        } catch (err) {
            console.error("Error adding customer:", err);
            alert("Gagal menambahkan pelanggan: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditOpen = (cust) => {
        setSelectedCustomer(cust);
        setFormData({
            fullname: cust.fullname || "",
            email: cust.email || "",
            phone: cust.phone || "",
            address: cust.address || ""
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await authAPI.updateCustomer(selectedCustomer.id, formData);
            setIsEditOpen(false);
            setSelectedCustomer(null);
            fetchCustomers();
        } catch (err) {
            console.error("Error updating customer:", err);
            alert("Gagal memperbarui data pelanggan: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data pelanggan ini?")) return;
        try {
            await authAPI.deleteCustomer(id);
            fetchCustomers();
        } catch (err) {
            console.error("Error deleting customer:", err);
            alert("Gagal menghapus pelanggan: " + err.message);
        }
    };

    const filteredCustomers = customers.filter((cust) => {
        const matchesSearch = 
            (cust.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cust.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cust.address || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleModalOpenChange = (open) => {
        setIsAddOpen(open);
        if (open) {
            setFormData({ fullname: "", email: "", phone: "", address: "" });
            setTimeout(() => {
                if (inputNamaRef.current) {
                    inputNamaRef.current.focus();
                }
            }, 100);
        }
    };

    return (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-stone-800 tracking-tight">Data Pelanggan</h1>
                    <p className="text-stone-400 text-sm font-medium">Pantau profil dan loyalitas pelanggan LuxWood.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={handleModalOpenChange}>
                    <DialogTrigger asChild>
                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-800 text-white rounded-xl text-sm font-bold hover:bg-amber-900 transition-all shadow-lg shadow-amber-200">
                            <FaUserPlus className="text-xs" /> Tambah Pelanggan
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[24px] p-6 max-w-md border border-stone-100 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-stone-800">Tambah Pelanggan Baru</DialogTitle>
                            <DialogDescription className="text-stone-400 text-xs mt-1">
                                Daftarkan data profile customer baru ke dalam sistem database internal LuxWood CRM.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="space-y-3 mt-4">
                            <input 
                                ref={inputNamaRef}
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleFormChange}
                                placeholder="Nama Lengkap" 
                                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                                required
                            />
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                placeholder="Alamat Email" 
                                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                                required
                            />
                            <input 
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                                placeholder="Nomor Telepon / WhatsApp" 
                                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                            />
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                placeholder="Alamat Lengkap" 
                                rows="3"
                                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                            />
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl transition-colors hover:bg-stone-200">Batal</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors hover:bg-amber-900">
                                    {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Modal Edit Pelanggan */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-[24px] p-6 max-w-md border border-stone-100 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-stone-800">Edit Data Pelanggan</DialogTitle>
                        <DialogDescription className="text-stone-400 text-xs mt-1">
                            Perbarui data profil pelanggan yang terdaftar di database.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-3 mt-4">
                        <input 
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleFormChange}
                            placeholder="Nama Lengkap" 
                            className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                            required
                        />
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="Alamat Email" 
                            className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                            required
                        />
                        <input 
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="Nomor Telepon / WhatsApp" 
                            className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                        />
                        <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            placeholder="Alamat Lengkap" 
                            rows="3"
                            className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" 
                        />
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl transition-colors hover:bg-stone-200">Batal</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors hover:bg-amber-900">
                                {isSubmitting ? "Memperbarui..." : "Perbarui Data"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Statistik Pelanggan */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Pelanggan", count: customers.length, icon: <FaUserCircle />, color: "bg-stone-900" },
                    { label: "Pelanggan Aktif", count: customers.length, icon: <FaUserCheck />, color: "bg-emerald-600" },
                    { label: "Sistem CRM", count: "Supabase", icon: <FaHistory />, color: "bg-amber-600" },
                    { label: "Tipe Database", count: "PostgreSQL", icon: <FaUserPlus />, color: "bg-blue-600" },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
                        <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{item.label}</p>
                            <p className="text-xl font-bold text-stone-800">{item.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* SHADCN TABS */}
            <Tabs defaultValue="database" className="w-full">
                <TabsList className="bg-stone-200/60 p-1 rounded-xl flex w-fit gap-1 mb-4">
                    <TabsTrigger value="database" className="rounded-lg px-4 py-1.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm">
                        Database Utama Supabase
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="database">
                    <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative w-full max-w-xs">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
                                <input 
                                    type="text"
                                    placeholder="Cari nama, email, atau alamat..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-20 text-center text-xs font-bold text-amber-800 animate-pulse tracking-wide">
                                    🔄 Memuat data pelanggan dari Supabase...
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-stone-50/50">
                                            <th className="p-5 pl-8 text-[10px] font-black text-stone-400 uppercase tracking-widest">Profil Pelanggan</th>
                                            <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Kontak Telepon</th>
                                            <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Alamat Pengiriman</th>
                                            <th className="p-5 pr-8 text-right text-[10px] font-black text-stone-400 uppercase tracking-widest">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50">
                                        {filteredCustomers.length > 0 ? (
                                            filteredCustomers.map((cust) => (
                                                <tr key={cust.id} className="hover:bg-stone-50/30 transition-colors group">
                                                    <td className="p-5 pl-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                                                                {(cust.fullname || "C").charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-stone-800 text-xs">{cust.fullname}</p>
                                                                <div className="flex items-center text-[10px] text-stone-400 font-bold lowercase">
                                                                    <FaEnvelope className="mr-1 text-[8px]" /> {cust.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center text-stone-600 text-xs font-medium">
                                                            <FaPhone className="mr-1.5 text-stone-400 text-[10px]" /> {cust.phone || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center text-stone-600 text-xs font-medium max-w-xs truncate">
                                                            <FaMapMarkerAlt className="mr-1.5 text-stone-400 shrink-0 text-[10px]" /> {cust.address || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="p-5 pr-8 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleEditOpen(cust)} 
                                                                className="p-2 text-stone-400 hover:text-amber-800 transition-colors rounded-lg hover:bg-amber-50"
                                                                title="Edit Pelanggan"
                                                            >
                                                                <FaEdit className="text-xs" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(cust.id)} 
                                                                className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                                title="Hapus Pelanggan"
                                                            >
                                                                <FaTrash className="text-xs" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-10 text-center text-xs font-medium text-stone-400">
                                                    Belum ada data pelanggan di database. Silakan klik "Tambah Pelanggan".
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}