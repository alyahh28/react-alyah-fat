import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FaAward, FaTools } from "react-icons/fa";
import { MdEdit, MdAssignment } from "react-icons/md";

export default function Craftsmen() {
    const [craftsmen, setCraftsmen] = useState([
        { id: 1, name: "Pak Slamet", expertise: "Ukir Jati", experience: "25 Tahun", status: "Idle", task: "None", img: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Andi Wijaya", expertise: "Finishing & Polishing", experience: "10 Tahun", status: "Working", task: "Finishing Meja Makan Jati", img: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Hendra Kurnia", expertise: "Konstruksi Kayu", experience: "15 Tahun", status: "Idle", task: "None", img: "https://i.pravatar.cc/150?u=3" },
        { id: 4, name: "Budi Santoso", expertise: "Desain Interior", experience: "8 Tahun", status: "Working", task: "Desain Lemari Custom", img: "https://i.pravatar.cc/150?u=4" },
        { id: 5, name: "Supriadi", expertise: "Pemotongan Presisi", experience: "20 Tahun", status: "Idle", task: "None", img: "https://i.pravatar.cc/150?u=5" },
        { id: 6, name: "Ahmad Junaidi", expertise: "Assembling", experience: "12 Tahun", status: "Working", task: "Merakit Kursi Malas", img: "https://i.pravatar.cc/150?u=6" },
    ]);

    const [selectedCraftsman, setSelectedCraftsman] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskInput, setTaskInput] = useState("");

    const handleUpdateTask = () => {
        if (!selectedCraftsman) return;
        
        const newCraftsmen = craftsmen.map(c => {
            if (c.id === selectedCraftsman.id) {
                const isTaskEmpty = taskInput.trim() === "" || taskInput.toLowerCase() === "none";
                return {
                    ...c,
                    task: isTaskEmpty ? "None" : taskInput,
                    status: isTaskEmpty ? "Idle" : "Working"
                };
            }
            return c;
        });

        setCraftsmen(newCraftsmen);
        
        // Audit log
        const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
        auditLogs.push({
            id: Date.now(),
            admin: localStorage.getItem("activeUser") || "Admin",
            role: localStorage.getItem("adminSubRole") || "super_admin",
            action: `Assigned task '${taskInput}' to craftsman ${selectedCraftsman.name}`,
            time: new Date().toLocaleString()
        });
        localStorage.setItem("audit_logs", JSON.stringify(auditLogs));

        setShowTaskModal(false);
    };

    return (
        <div className="p-8 w-full font-poppins bg-slate-50 min-h-screen">
            <PageHeader title="Master Craftsmen Management" />
            <p className="text-sm text-slate-500 mb-8 mt-2">
                Atur pembagian tugas pembuatan furnitur dan pantau status kerja para pengrajin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {craftsmen.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center relative">
                        <button 
                            onClick={() => { setSelectedCraftsman(item); setTaskInput(item.task === "None" ? "" : item.task); setShowTaskModal(true); }}
                            className="absolute top-4 right-4 p-2 bg-[#22285E]/10 text-[#22285E] hover:bg-[#22285E]/20 rounded-xl transition"
                            title="Assign Task"
                        >
                            <MdAssignment />
                        </button>
                        
                        <img src={item.img} alt={item.name} className="w-24 h-24 rounded-2xl mb-4 object-cover ring-4 ring-[#22285E]/5" />
                        <h3 className="font-bold text-stone-800 text-lg">{item.name}</h3>
                        <p className="text-[#9E4BDC] text-sm font-medium mb-4">{item.expertise}</p>
                        
                        <div className="flex gap-4 w-full border-t border-stone-50 pt-4 mt-2">
                            <div className="flex-1">
                                <p className="text-[10px] text-stone-400 uppercase font-bold">Status</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status === 'Working' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="flex-1 border-l border-stone-50">
                                <p className="text-[10px] text-stone-400 uppercase font-bold">Tugas Saat Ini</p>
                                <p className="text-xs font-bold text-stone-700 truncate px-2" title={item.task}>{item.task}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showTaskModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="font-bold text-lg text-slate-800 mb-2">Delegasi Tugas</h3>
                        <p className="text-xs text-slate-500 mb-4">Berikan tugas pembuatan untuk <strong>{selectedCraftsman?.name}</strong>. Kosongkan untuk mengatur status menjadi Idle.</p>
                        
                        <input 
                            type="text" 
                            value={taskInput} 
                            onChange={(e) => setTaskInput(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-4 outline-none focus:ring-2 focus:ring-[#22285E]"
                            placeholder="Contoh: Membuat Kursi Malas..."
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setShowTaskModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition">Batal</button>
                            <button onClick={handleUpdateTask} className="flex-1 py-3 bg-[#22285E] hover:bg-[#1a1e4a] text-white rounded-xl text-sm font-bold transition shadow-lg shadow-[#22285E]/30">Simpan Tugas</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}