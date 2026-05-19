// src/components/SiteHealthCard.jsx
export default function SiteHealthCard() {
    return (
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex flex-col gap-4">
            <div>
                <h4 className="text-[14px] font-bold text-[#22285E]">Wood Moisture Control</h4>
                <p className="text-[11px] text-gray-400 font-medium">Rata-rata kelembapan kayu di oven</p>
            </div>
            
            <div className="flex flex-col items-center justify-center relative my-2">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[12px] border-gray-100 border-t-[#9E4BDC] border-r-[#9E4BDC] rotate-45">
                    <span className="-rotate-45 text-2xl font-bold text-[#22285E]">11.4%</span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9E4BDC]"></span>
                    <span>Kelembapan Oven A (Jati): <b className="text-[#22285E]">11.4%</b></span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span>Batas Maksimal Aman: <b className="text-[#22285E]">12.0%</b></span>
                </div>
            </div>
        </div>
    );
}