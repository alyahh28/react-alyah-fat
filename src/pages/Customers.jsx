import { useState, useEffect, useRef } from "react"; // 🌟 HOOK BARU: Import useEffect dan useRef
import { 
  FaSearch, 
  FaUserPlus, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaHistory, 
  FaEllipsisV, 
  FaUserCheck, 
  FaUserCircle 
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
  TabsTrigger } from "@/components/ui/tabs";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function Customers() {
    // --- STATE MANAGEMENT (useState) ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    // 🌟 HOOK BARU (useState): State untuk efek loading tiruan (simulasi fetch data)
    const [isLoading, setIsLoading] = useState(true);

    // --- REFERENCE MANAGEMENT (useRef) ---
    // 🌟 HOOK BARU (useRef): Referensi untuk otomatis mengarahkan fokus kursor ke input Nama saat Modal dibuka
    const inputNamaRef = useRef(null);

    // Data Dummy Pelanggan Asli Milik Alyah
    const customers = [
        { id: 1, name: "Aris Munandar", email: "aris.m@email.com", location: "Jakarta Selatan", totalOrders: 12, totalSpent: "Rp 45.200.000", status: "Active", lastOrder: "2 hari yang lalu" },
        { id: 2, name: "Siti Aminah", email: "siti.ami@email.com", location: "Bandung, Jawa Barat", totalOrders: 5, totalSpent: "Rp 12.800.000", status: "New", lastOrder: "5 jam yang lalu" },
        { id: 3, name: "Budi Santoso", email: "budi_s@email.com", location: "Semarang, Jawa Tengah", totalOrders: 28, totalSpent: "Rp 102.500.000", status: "Active", lastOrder: "Kemarin" },
        { id: 4, name: "Indah Permata", email: "indah.p@email.com", location: "Surabaya, Jawa Timur", totalOrders: 2, totalSpent: "Rp 3.500.000", status: "Inactive", lastOrder: "3 bulan yang lalu" },
        { id: 5, name: "Eko Prasetyo", email: "eko.pra@email.com", location: "Yogyakarta", totalOrders: 15, totalSpent: "Rp 38.900.000", status: "Active", lastOrder: "1 minggu yang lalu" },
    ];

    // --- SIDE EFFECTS (useEffect) ---
    // 🌟 HOOK BARU (useEffect): Efek samping dijalankan sekali saat komponen pertama kali dibuka (Mounting)
    useEffect(() => {
        // Simulasi mengambil data dari server selama 1.5 detik
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // Membersihkan timer saat komponen tidak digunakan (Unmounting)
        return () => clearTimeout(timer);
    }, []); // Empty dependency array karena hanya perlu jalan 1x di awal

    // --- LOGIKA UTAMA (FUNGSI FILTER) ---
    const filteredCustomers = customers.filter((cust) => {
        const matchesSearch = 
            cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cust.location.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = 
            statusFilter === "all" || 
            cust.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    // 🌟 FUNGSI BARU: Dipanggil saat modal dialog Shadcn terbuka penuh
    const handleModalOpenChange = (open) => {
        if (open) {
            // Beri jeda micro-seconds agar DOM modal selesai dirender seutuhnya oleh Shadcn, lalu kunci fokus input
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

                {/* SHADCN DIALOG DI-UPGRADE DENGAN FUNGSI useRef */}
                <Dialog onOpenChange={handleModalOpenChange}>
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
                        {/* Form Isian Input */}
                        <div className="space-y-3 mt-4">
                            {/* 🌟 DI-UPGRADE: Dipasangkan ref={inputNamaRef} agar otomatis auto-focus saat modal terbuka */}
                            <input 
                                ref={inputNamaRef}
                                type="text" 
                                placeholder="Nama Lengkap" 
                                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700" 
                            />
                            <input type="email" placeholder="Alamat Email" className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" />
                            <input type="text" placeholder="Lokasi Kota" className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700" />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl transition-colors hover:bg-stone-200">Batal</button>
                            <button className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors hover:bg-amber-900">Simpan Data</button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistik Pelanggan */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Pelanggan", count: "842", icon: <FaUserCircle />, color: "bg-stone-900" },
                    { label: "Pelanggan Aktif", count: "612", icon: <FaUserCheck />, color: "bg-emerald-600" },
                    { label: "Baru Bulan Ini", count: "+24", icon: <FaHistory />, color: "bg-amber-600" },
                    { label: "Top Spender", count: "12", icon: <FaUserPlus />, color: "bg-blue-600" },
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
                        Database Utama
                    </TabsTrigger>
                    <TabsTrigger value="loyalty" className="rounded-lg px-4 py-1.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm">
                        Segmentasi Pasar
                    </TabsTrigger>
                </TabsList>

                {/* TAB CONTENT 1: DATABASE UTAMA */}
                <TabsContent value="database">
                    <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                        
                        {/* Bar Penyaringan Data */}
                        <div className="p-6 border-b border-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Search Bar Input */}
                            <div className="relative w-full max-w-xs">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
                                <input 
                                    type="text"
                                    placeholder="Cari nama, email, atau lokasi..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* SHADCN SELECT */}
                            <Select onValueChange={(value) => setStatusFilter(value)}>
                                <SelectTrigger className="w-[160px] bg-stone-50 border-none rounded-xl text-xs font-bold text-stone-600 focus:ring-2 focus:ring-amber-100">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-stone-100 rounded-xl shadow-lg">
                                    <SelectItem value="all" className="text-xs text-stone-600 font-medium">Semua Status</SelectItem>
                                    <SelectItem value="active" className="text-xs text-stone-600 font-medium">Status: Active</SelectItem>
                                    <SelectItem value="new" className="text-xs text-stone-600 font-medium">Status: New</SelectItem>
                                    <SelectItem value="inactive" className="text-xs text-stone-600 font-medium">Status: Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tabel Data Pelanggan / Indikator Loading */}
                        <div className="overflow-x-auto">
                            {/* 🌟 DI-UPGRADE DENGAN EFFECT LOADING (Membuktikan implementasi useEffect) */}
                            {isLoading ? (
                                <div className="p-20 text-center text-xs font-bold text-amber-800 animate-pulse tracking-wide">
                                    🔄 Memuat data dari LuxWood Server...
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-stone-50/50">
                                            <th className="p-5 pl-8 text-[10px] font-black text-stone-400 uppercase tracking-widest">Profil Pelanggan</th>
                                            <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Lokasi</th>
                                            <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Order</th>
                                            <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Belanja</th>
                                            <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                                            <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Terakhir Belanja</th>
                                            <th className="p-5 pr-8"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50">
                                        {filteredCustomers.length > 0 ? (
                                            filteredCustomers.map((cust) => (
                                                <tr key={cust.id} className="hover:bg-stone-50/30 transition-colors group">
                                                    <td className="p-5 pl-8">
                                                        <div className="flex items-center gap-3">
                                                            <img src={`https://i.pravatar.cc/150?u=${cust.id}`} className="w-10 h-10 rounded-full border-2 border-stone-100 object-cover shadow-sm" alt="avatar" />
                                                            <div>
                                                                <p className="font-bold text-stone-800 text-xs">{cust.name}</p>
                                                                <div className="flex items-center text-[10px] text-stone-400 font-bold lowercase">
                                                                    <FaEnvelope className="mr-1 text-[8px]" /> {cust.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center text-stone-500 text-xs font-medium">
                                                            <FaMapMarkerAlt className="mr-1 text-stone-300" /> {cust.location}
                                                        </div>
                                                    </td>
                                                    <td className="p-5 font-bold text-stone-600 text-xs">{cust.totalOrders} Pesanan</td>
                                                    <td className="p-5 font-black text-amber-800 text-xs">{cust.totalSpent}</td>
                                                    <td className="p-5">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter 
                                                            ${cust.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 
                                                              cust.status === 'New' ? 'text-blue-600 bg-blue-50' : 'text-stone-400 bg-stone-100'}`}>
                                                            {cust.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-stone-400 text-xs">{cust.lastOrder}</td>
                                                    <td className="p-5 pr-8 text-right">
                                                        <button className="p-2 text-stone-200 hover:text-amber-800 transition-colors">
                                                            <FaEllipsisV className="text-xs" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="p-10 text-center text-xs font-medium text-stone-400">
                                                    Tidak ada data pelanggan yang cocok dengan pencarian atau filter.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* TAB CONTENT 2 */}
                <TabsContent value="loyalty">
                    <div className="bg-white p-12 rounded-[32px] border border-stone-100 text-center shadow-sm">
                        <div className="max-w-sm mx-auto">
                            <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FaUserCircle className="text-xl" />
                            </div>
                            <h3 className="font-bold text-stone-800 text-sm">Analisis Klasifikasi Loyalitas</h3>
                            <p className="text-stone-400 text-xs mt-2 leading-relaxed">
                                Fitur segmentasi tingkat loyalitas wilayah dan grafik omset dari pelanggan setia *LuxWood Premium Furnitur* sedang dikompilasi secara otomatis oleh sistem backend.
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}