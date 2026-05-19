// src/components/dashboard/StatCard.jsx
export default function StatCard({ title, value, percentage, isUp, chartImage }) {
    return (
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</span>
                <span className="text-xl font-bold text-[#22285E]">{value}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
                {/* Di mockup ada mini chart, kita bisa pakai icon/image placeholder */}
                <div className="h-6 w-12 bg-purple-50 rounded-md flex items-center justify-center text-[10px] text-[#9E4BDC]">📈</div>
                <span className={`text-[11px] font-bold flex items-center ${isUp ? 'text-green-500' : 'text-purple-500'}`}>
                    {percentage} {isUp ? '↑' : '↓'}
                </span>
            </div>
        </div>
    );
}