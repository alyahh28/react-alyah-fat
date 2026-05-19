// src/components/PromoBanner.jsx
export default function PromoBanner() {
    return (
        <div className="bg-gradient-to-r from-[#9E4BDC] to-[#b366ec] p-8 rounded-[30px] text-white flex justify-between items-center relative overflow-hidden shadow-xl shadow-[#9E4BDC]/10">
            <div className="max-w-[65%] flex flex-col gap-2 z-10">
                <h3 className="text-xl font-bold leading-tight">Mulai Fitur Workshop Premium!</h3>
                <p className="text-[11px] text-white/80 leading-relaxed">Kelola manajemen pengrajin, pantau siklus pengeringan kayu Jati, dan lacak inventori logistik lebih efisien dengan sistem cloud.</p>
            </div>
            <button className="bg-white text-[#9E4BDC] font-bold text-xs px-6 py-3 rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all z-10 whitespace-nowrap">
                Upgrade Now
            </button>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 -skew-x-12 transform origin-top-right"></div>
        </div>
    );
}