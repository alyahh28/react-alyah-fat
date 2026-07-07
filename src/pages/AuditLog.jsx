import { useState, useEffect } from "react";
import { MdSecurity, MdHistory, MdBackup, MdDownload } from "react-icons/md";

export default function AuditLog() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const storedLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
        // Sort descending by time
        storedLogs.sort((a, b) => new Date(b.time) - new Date(a.time));
        setLogs(storedLogs);
    }, []);

    const handleBackup = () => {
        // Create backup JSON containing all localStorage data (simulated DB backup)
        const backupData = {
            audit_logs: JSON.parse(localStorage.getItem("audit_logs") || "[]"),
            banned_users: JSON.parse(localStorage.getItem("banned_users") || "[]"),
            local_orders: Object.keys(localStorage).filter(k => k.startsWith("local_orders")).map(k => ({ [k]: JSON.parse(localStorage.getItem(k)) })),
            point_history: Object.keys(localStorage).filter(k => k.startsWith("point_history")).map(k => ({ [k]: JSON.parse(localStorage.getItem(k)) }))
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `FurinitureQ_Backup_${Date.now()}.json`);
        a.click();
        
        alert("Database Backup Berhasil Diunduh!");
        
        // Log this action
        const newLog = {
            id: Date.now(),
            admin: localStorage.getItem("activeUser") || "Admin",
            role: localStorage.getItem("adminSubRole") || "super_admin",
            action: `Downloaded Database Backup`,
            time: new Date().toLocaleString()
        };
        const updatedLogs = [newLog, ...logs];
        localStorage.setItem("audit_logs", JSON.stringify(updatedLogs));
        setLogs(updatedLogs);
    };

    return (
        <div className="p-8 w-full font-poppins bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <MdSecurity className="text-indigo-600" /> Security & Audit Logs
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Pantau jejak digital aksi administrator dan kelola pencadangan database.
                    </p>
                </div>
                <button onClick={handleBackup} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">
                    <MdBackup /> Database Backup
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <MdHistory className="text-slate-500 text-xl" />
                    <h2 className="font-bold text-slate-800">Riwayat Aktivitas Admin</h2>
                </div>
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white sticky top-0 border-b border-slate-100 text-slate-500 font-bold">
                            <tr>
                                <th className="py-4 px-6">Waktu</th>
                                <th className="py-4 px-6">Admin</th>
                                <th className="py-4 px-6">Role</th>
                                <th className="py-4 px-6">Aksi (Jejak Digital)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log, i) => (
                                <tr key={log.id || i} className="hover:bg-slate-50/50">
                                    <td className="py-4 px-6 text-slate-500 font-mono text-xs">{log.time}</td>
                                    <td className="py-4 px-6 font-bold text-slate-800">{log.admin}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                            {log.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-700">{log.action}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-10 text-center text-slate-400">Belum ada jejak aktivitas admin.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
