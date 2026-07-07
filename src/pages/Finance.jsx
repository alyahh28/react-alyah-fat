import { useState } from "react";
import { MdAccountBalanceWallet, MdMoneyOff, MdFileDownload, MdAdd } from "react-icons/md";
import PageHeader from "../components/PageHeader";

export default function Finance() {
    const [expenses, setExpenses] = useState([
        { id: 1, type: "Wastage", description: "Kayu Jati Cacat", amount: 1500000, date: "2026-07-06" },
        { id: 2, type: "Operational", description: "Listrik Workshop", amount: 2500000, date: "2026-07-05" },
        { id: 3, type: "Wastage", description: "Cat Kering", amount: 300000, date: "2026-07-01" },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ type: "Operational", description: "", amount: 0 });

    const handleAddExpense = (e) => {
        e.preventDefault();
        const newExpense = {
            id: Date.now(),
            ...formData,
            date: new Date().toISOString().split("T")[0]
        };
        setExpenses([newExpense, ...expenses]);
        setShowModal(false);
        setFormData({ type: "Operational", description: "", amount: 0 });

        // Audit log
        const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
        auditLogs.push({
            id: Date.now(),
            admin: localStorage.getItem("activeUser") || "Admin",
            role: localStorage.getItem("adminSubRole") || "super_admin",
            action: `Added ${formData.type} Expense: Rp ${formData.amount}`,
            time: new Date().toLocaleString()
        });
        localStorage.setItem("audit_logs", JSON.stringify(auditLogs));
    };

    const handleExportCSV = () => {
        const csvRows = [];
        const headers = ["ID", "Tipe", "Deskripsi", "Jumlah (Rp)", "Tanggal"];
        csvRows.push(headers.join(","));

        expenses.forEach(exp => {
            const row = [exp.id, exp.type, `"${exp.description}"`, exp.amount, exp.date];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `Laporan_Keuangan_FurinitureQ_${Date.now()}.csv`);
        a.click();
    };

    const totalOperational = expenses.filter(e => e.type === "Operational").reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalWastage = expenses.filter(e => e.type === "Wastage").reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <div className="p-8 w-full font-poppins bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <MdAccountBalanceWallet className="text-[#22285E]" /> Finance & Logistics
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola arus kas keluar, biaya operasional, dan material wastage.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#22285E] hover:bg-[#1a1e4a] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">
                        <MdAdd /> Catat Pengeluaran
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">
                        <MdFileDownload /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                        <MdAccountBalanceWallet className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Operasional</p>
                        <p className="text-2xl font-black text-slate-800">Rp {totalOperational.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <MdMoneyOff className="text-red-600 text-2xl" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Wastage Material</p>
                        <p className="text-2xl font-black text-red-600">Rp {totalWastage.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase font-bold tracking-wider">
                            <th className="py-4 px-6">Tanggal</th>
                            <th className="py-4 px-6">Tipe</th>
                            <th className="py-4 px-6">Keterangan</th>
                            <th className="py-4 px-6 text-right">Jumlah (Rp)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium">
                        {expenses.map(exp => (
                            <tr key={exp.id} className="hover:bg-slate-50/50">
                                <td className="py-4 px-6 text-slate-500">{exp.date}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${exp.type === 'Wastage' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {exp.type}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-slate-800">{exp.description}</td>
                                <td className="py-4 px-6 text-right font-black text-slate-800">{Number(exp.amount).toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        {expenses.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-slate-400">Belum ada catatan pengeluaran.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Catat Pengeluaran Kas</h3>
                        
                        <form onSubmit={handleAddExpense} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Pengeluaran</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#22285E]"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Operational">Biaya Operasional</option>
                                    <option value="Wastage">Wastage / Kerugian Material</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Contoh: Tagihan Listrik"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#22285E]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah (Rp)</label>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#22285E]"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition">Batal</button>
                                <button type="submit" className="flex-1 py-3 bg-[#22285E] hover:bg-[#1a1e4a] text-white rounded-xl text-sm font-bold transition shadow-lg shadow-[#22285E]/30">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
