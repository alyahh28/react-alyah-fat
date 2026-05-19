// src/components/dashboard/CurrencyMiniCard.jsx
export default function CurrencyMiniCard({ code, fullValue, rate, bgClass, isUp }) {
    return (
        <div className={`p-4 rounded-[20px] text-white flex flex-col justify-between h-28 w-full shadow-sm ${bgClass}`}>
            <div className="flex flex-col">
                <span className="text-[11px] font-bold">{code}</span>
                <span className="text-[9px] opacity-70">{fullValue}</span>
            </div>
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold tracking-tight">{rate}</span>
                <span className="text-xs">{isUp ? '📈' : '📉'}</span>
            </div>
        </div>
    );
}