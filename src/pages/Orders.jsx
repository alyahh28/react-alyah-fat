import { useState } from "react";
import { FaSearch, FaFilter, FaEllipsisV, FaBox, FaShippingFast, FaCheckCircle, FaClock } from "react-icons/fa";

export default function Orders() {
    const [searchTerm, setSearchTerm] = useState("");

    // Data Dummy Pesanan
    const orders = [
        { id: "#LW-9901", customer: "Dian Sastro", product: "Meja Makan Jati", date: "12 May 2024", amount: "Rp 12.500.000", status: "Processing", color: "text-amber-600 bg-amber-50" },
        { id: "#LW-9902", customer: "Reza Rahadian", product: "Kursi Kerja Ergonomis", date: "11 May 2024", amount: "Rp 4.200.000", status: "Shipped", color: "text-blue-600 bg-blue-50" },
        { id: "#LW-9903", customer: "Nicholas Saputra", product: "Lemari Pakaian Minimalis", date: "10 May 2024", amount: "Rp 8.750.000", status: "Completed", color: "text-emerald-600 bg-emerald-50" },
        { id: "#LW-9904", customer: "Raisa Andriana", product: "Buffet TV Mahoni", date: "09 May 2024", amount: "Rp 6.300.000", status: "Pending", color: "text-stone-400 bg-stone-50" },
        { id: "#LW-9905", customer: "Ariel Noah", product: "Set Meja Cafe", date: "08 May 2024", amount: "Rp 15.000.000", status: "Completed", color: "text-emerald-600 bg-emerald-50" },
    ];

    return (
        <div className="p-6 animate-in fade-in duration-700">
            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-stone-800 tracking-tight">Pesanan Masuk</h1>
                    <p className="text-stone-400 text-sm font-medium">Kelola dan pantau semua pesanan furniture pelanggan.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 transition-all shadow-sm">
                        <FaFilter className="text-xs" /> Filter
                    </button>
                    <button className="px-6 py-2.5 bg-amber-800 text-white rounded-xl text-sm font-bold hover:bg-amber-900 transition-all shadow-lg shadow-amber-200">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Ringkasan Status */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Pesanan", count: "1,240", icon: <FaBox />, color: "bg-stone-900" },
                    { label: "Menunggu QC", count: "12", icon: <FaClock />, color: "bg-amber-600" },
                    { label: "Sedang Kirim", count: "45", icon: <FaShippingFast />, color: "bg-blue-600" },
                    { label: "Selesai", count: "1,183", icon: <FaCheckCircle />, color: "bg-emerald-600" },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-sm flex items-center gap-4">
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

            {/* Tabel Pesanan */}
            <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                    <div className="relative w-full max-w-xs">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
                        <input 
                            type="text"
                            placeholder="Cari ID atau nama..."
                            className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50/50">
                                <th className="p-4 pl-8 text-[10px] font-black text-stone-400 uppercase tracking-widest">ID Pesanan</th>
                                <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Pelanggan</th>
                                <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Produk</th>
                                <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Tanggal</th>
                                <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Total</th>
                                <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                                <th className="p-4 pr-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-stone-50/30 transition-colors group">
                                    <td className="p-4 pl-8 font-bold text-stone-800 text-xs">{order.id}</td>
                                    <td className="p-4 font-bold text-stone-600 text-xs">{order.customer}</td>
                                    <td className="p-4 text-stone-500 text-xs font-medium">{order.product}</td>
                                    <td className="p-4 text-stone-400 text-xs">{order.date}</td>
                                    <td className="p-4 font-black text-stone-800 text-xs">{order.amount}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.color}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-8 text-right">
                                        <button className="p-2 text-stone-300 hover:text-amber-700 transition-colors">
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