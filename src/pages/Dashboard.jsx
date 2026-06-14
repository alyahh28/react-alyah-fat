// src/pages/Dashboard.jsx
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import PromoBanner from "../components/PromoBanner";
import SiteHealthCard from "../components/SiteHealthCard";
import OnlineSalesCard from "../components/OnlineSalesCard";
import ClientStatisticCard from "../components/ClientStatisticCard";
import CurrencyStatusCard from "../components/CurrencyStatusCard";
import MiningStatusCard from "../components/MiningStatusCard";
import MyBalancesCard from "../components/MyBalancesCard";

export default function Dashboard() {   
    return (
        <div className="flex-1 bg-[#F4F4F4] min-h-screen p-8 overflow-x-hidden font-poppins text-slate-800">
            
            {/* Header bawa judul custom */}
            <Header pageTitle="Workshop Overview" />

            {/* Sub-header text workshop */}
            <div className="mb-6 -mt-2">
                <p className="text-gray-400 text-xs font-medium">
                    Workshop LuxWood hari ini dipantau berjalan dengan optimal.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-2">
                
                {/* COLUMN 1 & 2 (Kiri dan Tengah) */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    
                    {/* Section Workshop Stats */}
                    <div className="flex flex-col gap-3">
                        <h2 className="font-bold text-[#22285E] text-lg">Workshop Stats</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <StatCard title="ACTIVE PROJECTS" value="42 Units" percentage="12%" isUp={true} />
                            <StatCard title="PRODUCTION DONE" value="75%" percentage="05%" isUp={true} />
                            <StatCard title="TOTAL REVENUE" value="Rp 184.5M" percentage="10%" isUp={true} />
                            <StatCard title="MATERIAL WASTAGE" value="2.4%" percentage="06%" isUp={false} />
                        </div>
                    </div>

                    {/* Banner Fitur Premium Cloud Workshop */}
                    <PromoBanner />

                    {/* Row Tengah: Logistik & Penjualan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <SiteHealthCard />
                        <OnlineSalesCard />
                    </div>

                    {/* Row Bawah: Ketersediaan Bahan & Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <CurrencyStatusCard />
                        </div>
                        <div className="md:col-span-2">
                            <ClientStatisticCard />
                        </div>
                    </div>
                </div>

                {/* COLUMN 3 (Kanan) */}
                <div className="flex flex-col gap-8">
                    {/* Status Keaktifan Pengrajin */}
                    <MiningStatusCard />

                    {/* Arus Kas / Keuangan Gudang */}
                    <MyBalancesCard />
                </div>

            </div>
        </div>
    );
}