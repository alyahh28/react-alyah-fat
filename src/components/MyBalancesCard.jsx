// src/components/MyBalancesCard.jsx
import BalanceCard from "./BalanceCard";

export default function MyBalancesCard() {
    return (
        <div className="flex flex-col gap-3 w-full">
            <div>
                <h4 className="text-[14px] font-bold text-[#9E4BDC]">Workshop Balances</h4>
                <p className="text-[11px] text-gray-400">Kas keuangan produksi</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BalanceCard currencySign="Rp" currencyName="Kas Utama" amount="145.2 M" conversion="Budget Operasional" bgClass="bg-[#9E4BDC]" />
                <BalanceCard currencySign="Rp" currencyName="Kas Logistik" amount="12.5 M" conversion="Dana Cepat Kayu/Baut" bgClass="bg-emerald-400" />
            </div>
        </div>
    );
}