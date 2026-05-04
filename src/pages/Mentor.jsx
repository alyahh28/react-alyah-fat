import PageHeader from "../components/PageHeader";
import { FaAward, FaTools } from "react-icons/fa";

export default function Mentor() {
    const craftsmen = [
        { id: 1, name: "Pak Slamet", expertise: "Ukir Jati", experience: "25 Tahun", status: "Active", img: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Andi Wijaya", expertise: "Finishing & Polishing", experience: "10 Tahun", status: "On Leave", img: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Hendra Kurnia", expertise: "Konstruksi Kayu", experience: "15 Tahun", status: "Active", img: "https://i.pravatar.cc/150?u=3" },
    ];

    return (
        <div className="p-4">
            <PageHeader title="Master Craftsmen" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {craftsmen.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                        <img src={item.img} alt={item.name} className="w-24 h-24 rounded-2xl mb-4 object-cover ring-4 ring-amber-50" />
                        <h3 className="font-bold text-stone-800 text-lg">{item.name}</h3>
                        <p className="text-amber-700 text-sm font-medium mb-4">{item.expertise}</p>
                        
                        <div className="flex gap-4 w-full border-t border-stone-50 pt-4 mt-2">
                            <div className="flex-1">
                                <p className="text-[10px] text-stone-400 uppercase font-bold">Exp</p>
                                <p className="text-sm font-bold text-stone-700">{item.experience}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-stone-400 uppercase font-bold">Status</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}