// src/pages/Dashboard.jsx
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SiteHealthCard from "../components/SiteHealthCard";
import OnlineSalesCard from "../components/OnlineSalesCard";
import MyBalancesCard from "../components/MyBalancesCard";
import { useEffect, useState } from "react";
import { MdWarning, MdWaterDrop } from "react-icons/md";
import { authAPI } from "../services/authAPI";

// Mock Components for FurinitureQ specific needs
const OvenMonitorCard = () => (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
            <h3 className="text-[#9E4BDC] font-bold text-sm mb-1">Wood Oven Moisture</h3>
            <p className="text-2xl font-black text-gray-800">12.4<span className="text-sm font-medium text-gray-500">% MC</span></p>
            <p className="text-xs text-green-500 font-medium mt-1">✓ Optimal for furniture</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <MdWaterDrop className="text-blue-500 text-3xl" />
        </div>
    </div>
);

const LowStockAlert = () => (
    <div className="bg-orange-50 rounded-3xl p-6 shadow-sm border border-orange-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex shrink-0 items-center justify-center">
            <MdWarning className="text-orange-500 text-xl" />
        </div>
        <div>
            <h3 className="text-orange-800 font-bold text-sm mb-1">Low Stock Alert</h3>
            <p className="text-xs text-orange-600 mb-2">Critical raw materials running low:</p>
            <ul className="text-xs text-orange-700 font-medium space-y-1">
                <li>• Kayu Jati Perhutani (Grade A) - 3 m³</li>
                <li>• Lem Fox Prima - 2 Pail</li>
            </ul>
        </div>
    </div>
);



export default function Dashboard() {   
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState({
        activeUsers: 0,
        completedOrders: 0,
        totalOrders: 0,
        totalRevenue: 0,
        prodCash: 0
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        
        const fetchDashboardData = async () => {
            try {
                const users = await authAPI.getAllUsers();
                const orders = await authAPI.getAllOrders();
                
                const completed = orders.filter(o => o.status === 'completed');
                const revenue = completed.reduce((sum, order) => sum + (order.total_price || 0), 0);
                
                setStats({
                    activeUsers: users.length,
                    completedOrders: completed.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    prodCash: revenue * 0.15 // Estimasi uang tunai
                });
            } catch (err) {
                console.error("Gagal memuat data dashboard:", err);
            }
        };

        fetchDashboardData();
        return () => clearInterval(timer);
    }, []);

    const productionPercentage = stats.totalOrders > 0 
        ? Math.round((stats.completedOrders / stats.totalOrders) * 100) 
        : 0;

    return (
        <div className="flex-1 bg-[#F4F4F4] min-h-screen p-8 overflow-x-hidden font-poppins text-slate-800">
            
            <Header pageTitle="FurinitureQ Command Center" />

            <div className="mb-8 flex justify-between items-center -mt-2">
                <p className="text-gray-500 text-xs font-medium">
                    Monitor produksi dan operasional secara real-time.
                </p>
                <div className="text-xs font-bold bg-white px-4 py-1.5 rounded-full shadow-sm text-[#9E4BDC]">
                    {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-2">
                
                {/* COLUMN 1 & 2 */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="ACTIVE USERS" value={stats.activeUsers.toLocaleString('id-ID')} percentage="Real-time" isUp={true} />
                        <StatCard title="PRODUCTION DONE" value={`${productionPercentage}%`} percentage={`${stats.completedOrders} / ${stats.totalOrders}`} isUp={true} />
                        <StatCard title="TOTAL REVENUE" value={`Rp ${(stats.totalRevenue/1000000).toFixed(1)}M`} percentage="Real-time" isUp={true} />
                        <StatCard title="PROD. CASH" value={`Rp ${(stats.prodCash/1000000).toFixed(1)}M`} percentage="Est 15%" isUp={true} />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <OnlineSalesCard /> {/* Sales Chart */}
                        <SiteHealthCard /> {/* Contains some activity data */}
                    </div>

                    {/* Monitor Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <OvenMonitorCard />
                        <LowStockAlert />
                    </div>
                </div>

                {/* COLUMN 3 */}
                <div className="flex flex-col gap-8">
                    {/* Arus Kas / Keuangan Gudang */}
                    <MyBalancesCard />
                </div>

            </div>
        </div>
    );
}