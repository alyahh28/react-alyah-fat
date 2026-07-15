import { useState, useEffect } from "react";
import { FaSearch, FaBox, FaShippingFast, FaCheckCircle, FaClock } from "react-icons/fa";
import { authAPI } from "../services/authAPI";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await authAPI.getAllOrders();
            setOrders(data || []);
        } catch (err) {
            console.error("Gagal mengambil data pesanan:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        
        // Cek jika ini adalah data dummy (ID berawalan ORD-)
        if (orderId.toString().startsWith("ORD-")) {
            setTimeout(() => {
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                setUpdatingId(null);
            }, 500); // simulasi delay loading
            return;
        }

        try {
            await authAPI.updateOrderStatus(orderId, newStatus);
            await fetchOrders();
        } catch (err) {
            console.error("Gagal mengalihkan status pesanan:", err);
            alert("Gagal memperbarui status: " + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = orders.filter((o) => {
        const customerName = o.users?.fullname || "Member";
        const productTitle = o.products?.title || "Produk";
        const matchesSearch = 
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productTitle.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;
    const shippedCount = orders.filter(o => o.status === 'shipped').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'processing': return 'text-blue-700 bg-blue-50 border-blue-200';
            case 'shipped': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
            case 'completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            default: return 'text-stone-600 bg-stone-50 border-stone-200';
        }
    };

    return (
        <div className="p-6 animate-in fade-in duration-700">
            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-stone-800 tracking-tight">Pesanan Masuk</h1>
                    <p className="text-stone-400 text-sm font-medium">Kelola dan pantau semua pesanan furnitur pelanggan dari Supabase.</p>
                </div>
            </div>

            {/* Ringkasan Status */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Pesanan", count: orders.length, icon: <FaBox />, color: "bg-stone-900" },
                    { label: "Pending", count: pendingCount, icon: <FaClock />, color: "bg-amber-600" },
                    { label: "Sedang Kirim", count: shippedCount, icon: <FaShippingFast />, color: "bg-blue-600" },
                    { label: "Selesai", count: completedCount, icon: <FaCheckCircle />, color: "bg-emerald-600" },
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
                            placeholder="Cari ID pesanan, member, atau produk..."
                            className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center font-bold text-amber-800 animate-pulse text-xs tracking-wide">
                            🔄 Memuat transaksi pesanan dari Supabase...
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50/50">
                                    <th className="p-4 pl-8 text-[10px] font-black text-stone-400 uppercase tracking-widest">ID Pesanan</th>
                                    <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Pelanggan (Member)</th>
                                    <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Produk Dipesan</th>
                                    <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Jumlah</th>
                                    <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Harga</th>
                                    <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Ubah Status</th>
                                    <th className="p-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-stone-50/30 transition-colors group">
                                            <td className="p-4 pl-8 font-bold text-stone-800 text-xs font-mono">#{order.id.slice(0, 8)}</td>
                                            <td className="p-4 font-bold text-stone-600 text-xs">
                                                {order.users?.fullname || "Member"}
                                                <span className="block text-[10px] font-normal text-stone-400">{order.users?.email}</span>
                                            </td>
                                            <td className="p-4 text-stone-700 text-xs font-medium">{order.products?.title || "Produk Furnitur"}</td>
                                            <td className="p-4 text-stone-600 text-xs font-bold">{order.quantity} Pcs</td>
                                            <td className="p-4 font-black text-amber-900 text-xs">Rp {(order.total_price || 0).toLocaleString('id-ID')}</td>
                                            <td className="p-4">
                                                <select
                                                    value={order.status || "pending"}
                                                    disabled={updatingId === order.id}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-[11px] font-bold outline-none border cursor-pointer transition-all ${getStatusBadgeClass(order.status)}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => {
                                                        alert(`Mencetak label pengiriman untuk pesanan #${order.id}...`);
                                                        // Audit log
                                                        const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
                                                        auditLogs.push({
                                                            id: Date.now(),
                                                            admin: localStorage.getItem("activeUser") || "Admin",
                                                            role: localStorage.getItem("adminSubRole") || "super_admin",
                                                            action: `Cetak Label Pesanan #${order.id}`,
                                                            time: new Date().toLocaleString()
                                                        });
                                                        localStorage.setItem("audit_logs", JSON.stringify(auditLogs));
                                                    }}
                                                    className="px-3 py-1.5 bg-[#22285E] hover:bg-[#1a1e4a] text-white text-[10px] font-bold rounded-lg shadow-sm"
                                                >
                                                    Cetak Label
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-10 text-center text-xs font-medium text-stone-400">
                                            Belum ada pesanan masuk di database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}