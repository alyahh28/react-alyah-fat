// src/components/dashboard/BalanceCard.jsx
export default function BalanceCard({ currencySign, currencyName, amount, conversion, bgClass }) {
    return (
        <div className={`p-5 rounded-[24px] text-white flex flex-col justify-between h-40 w-full relative overflow-hidden shadow-sm ${bgClass}`}>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold opacity-90 flex items-center gap-1">
                    <span className="text-base">{currencySign}</span> {currencyName}
                </span>
                <span className="text-2xl font-black tracking-wide mt-1">{amount}</span>
            </div>
            
            <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                <span className="text-[10px] font-medium opacity-80">{conversion}</span>
                <button className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center font-bold text-sm transition-all">
                    +
                </button>
            </div>
        </div>
    );
}