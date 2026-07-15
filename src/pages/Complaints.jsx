import { useState } from "react";
import { MdReportProblem, MdCheckCircle, MdCancel, MdLoop } from "react-icons/md";
import PageHeader from "../components/PageHeader";

export default function Complaints() {
    const [complaints, setComplaints] = useState(() => {
        const stored = localStorage.getItem("complaints");
        if (stored) {
            return JSON.parse(stored);
        }
        const initial = [
            { id: "CMP-101", orderId: "ORD-998", customer: "Budi Santoso", issue: "Barang lecet saat pengiriman", status: "Pending", date: "2026-07-07" },
            { id: "CMP-102", orderId: "ORD-912", customer: "Siti Aminah", issue: "Warna tidak sesuai pesanan", status: "Refunded", date: "2026-07-05" },
            { id: "CMP-103", orderId: "ORD-854", customer: "Joko Anwar", issue: "Kurang baut perakitan", status: "Resolved", date: "2026-07-02" },
        ];
        localStorage.setItem("complaints", JSON.stringify(initial));
        return initial;
    });

    const handleAction = (id, newStatus) => {
        const updated = complaints.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setComplaints(updated);
        localStorage.setItem("complaints", JSON.stringify(updated));

        // Audit log
        const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
        auditLogs.push({
            id: Date.now(),
            admin: localStorage.getItem("activeUser") || "Admin",
            role: localStorage.getItem("adminSubRole") || "super_admin",
            action: `Changed Complaint ${id} status to ${newStatus}`,
            time: new Date().toLocaleString()
        });
        localStorage.setItem("audit_logs", JSON.stringify(auditLogs));
    };

    const getStatusStyle = (status) => {
        if (status === 'Pending') return 'bg-amber-100 text-amber-700';
        if (status === 'Resolved') return 'bg-green-100 text-green-700';
        if (status === 'Refunded') return 'bg-blue-100 text-blue-700';
        if (status === 'Rejected') return 'bg-red-100 text-red-700';
        return 'bg-stone-100 text-stone-700';
    };

    return (
        <div className="p-8 w-full font-poppins bg-slate-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <MdReportProblem className="text-red-500" /> Complaints & Refunds
                </h1>
                <p className="text-sm text-slate-500 mt-1">Kelola keluhan pelanggan, retur barang, dan proses pengembalian dana.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase font-bold tracking-wider">
                            <th className="py-4 px-6">ID Komplain</th>
                            <th className="py-4 px-6">ID Pesanan</th>
                            <th className="py-4 px-6">Pelanggan</th>
                            <th className="py-4 px-6">Kendala</th>
                            <th className="py-4 px-6 text-center">Status</th>
                            <th className="py-4 px-6 text-center">Aksi (Proses)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium">
                        {complaints.map(cmp => (
                            <tr key={cmp.id} className="hover:bg-slate-50/50">
                                <td className="py-4 px-6 text-slate-500 font-bold">{cmp.id}</td>
                                <td className="py-4 px-6 text-[#22285E] underline cursor-pointer">{cmp.orderId}</td>
                                <td className="py-4 px-6 text-slate-800">{cmp.customer}</td>
                                <td className="py-4 px-6 text-slate-600">{cmp.issue}</td>
                                <td className="py-4 px-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(cmp.status)}`}>
                                        {cmp.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {cmp.status === 'Pending' ? (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleAction(cmp.id, 'Resolved')} className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg tooltip" title="Tandai Selesai">
                                                <MdCheckCircle />
                                            </button>
                                            <button onClick={() => handleAction(cmp.id, 'Refunded')} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg tooltip" title="Proses Refund">
                                                <MdLoop />
                                            </button>
                                            <button onClick={() => handleAction(cmp.id, 'Rejected')} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg tooltip" title="Tolak Komplain">
                                                <MdCancel />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Diselesaikan</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {complaints.length === 0 && (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-slate-400">Tidak ada komplain saat ini.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
