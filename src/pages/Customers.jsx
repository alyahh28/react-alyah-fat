import { useState } from "react";
import { FaSearch, FaUserPlus, FaEnvelope, FaMapMarkerAlt, FaHistory, FaEllipsisV, FaUserCheck, FaUserCircle } from "react-icons/fa";

export default function Customers() {
    const [searchTerm, setSearchTerm] = useState("");

    // Data Dummy Pelanggan
    const customers = [
        { id: 1, name: "Aris Munandar", email: "aris.m@email.com", location: "Jakarta Selatan", totalOrders: 12, totalSpent: "Rp 45.200.000", status: "Active", lastOrder: "2 hari yang lalu" },
        { id: 2, name: "Siti Aminah", email: "siti.ami@email.com", location: "Bandung, Jawa Barat", totalOrders: 5, totalSpent: "Rp 12.800.000", status: "New", lastOrder: "5 jam yang lalu" },
        { id: 3, name: "Budi Santoso", email: "budi_s@email.com", location: "Semarang, Jawa Tengah", totalOrders: 28, totalSpent: "Rp 102.500.000", status: "Active", lastOrder: "Kemarin" },
        { id: 4, name: "Indah Permata", email: "indah.p@email.com", location: "Surabaya, Jawa Timur", totalOrders: 2, totalSpent: "Rp 3.500.000", status: "Inactive", lastOrder: "3 bulan yang lalu" },
        { id: 5, name: "Eko Prasetyo", email: "eko.pra@email.com", location: "Yogyakarta", totalOrders: 15, totalSpent: "Rp 38.900.000", status: "Active", lastOrder: "1 minggu yang lalu" },
    ];

    return (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-stone-800 tracking-tight">Data Pelanggan</h1>
                    <p className="text-stone-400 text-sm font-medium">Pantau profil dan loyalitas pelanggan LuxWood.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-800 text-white rounded-xl text-sm font-bold hover:bg-amber-900 transition-all shadow-lg shadow-amber-200">
                    <FaUserPlus className="text-xs" /> Tambah Pelanggan
                </button>
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

            {/* List Pelanggan */}
            <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full max-w-xs">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
                        <input 
                            type="text"
                            placeholder="Cari nama, email, atau lokasi..."
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
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
                            {customers.map((cust) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}