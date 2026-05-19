// src/components/ClientStatisticCard.jsx
export default function ClientStatisticCard() {
    return (
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-[14px] font-bold text-[#22285E]">Production Flow Trend</h4>
                    <p className="text-[10px] text-gray-400">Statistik performa pengerjaan furniture</p>
                </div>
                <div className="flex gap-2 text-[10px] font-bold">
                    <span className="bg-purple-100 text-[#9E4BDC] px-2.5 py-1 rounded-md">Meja</span>
                    <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Kursi</span>
                </div>
            </div>
            
            <div className="h-32 w-full flex items-end justify-between px-2 pt-4 relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,22 Q25,8 50,18 T100,10" fill="none" stroke="#9E4BDC" strokeWidth="1.5" />
                    <path d="M0,15 Q25,25 50,12 T100,18" fill="none" stroke="#22285E" strokeWidth="1.5" />
                </svg>
                {['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'].map((m) => (
                    <span key={m} className="text-[10px] text-gray-400 font-bold z-10">{m}</span>
                ))}
            </div>
        </div>
    );
}