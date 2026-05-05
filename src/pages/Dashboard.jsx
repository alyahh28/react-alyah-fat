import { FaSearch, FaArrowUp } from "react-icons/fa";
import { MdChair, MdTableBar, MdHandyman, MdTrendingUp, MdLocalShipping } from "react-icons/md";
import ProfileImage from "../assets/alyah.jpeg";

export default function Dashboard() {
    return (
        <div className="flex-1 bg-[#F4F4F4] min-h-screen p-8 font-poppins">
            {/* Header: Sesuai Anatomi Template */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-[#22285E]">Hi, Admin Woody 👋</h1>
                    <p className="text-gray-400 text-xs font-medium mt-1">Workshop kamu hari ini berjalan dengan baik.</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <FaSearch className="absolute left-6 top-4.5 text-gray-400 text-sm" />
                        <input type="text" placeholder="Cari katalog furniture..." className="bg-white px-14 py-4 rounded-full w-[400px] shadow-sm outline-none border-none text-sm font-medium" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-[#22285E]">Alyah Woody</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Admin</p>
                        </div>
                        <img src={ProfileImage} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" alt="profile" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Kolom 1: Stats Furniture */}
                <div className="col-span-3 space-y-5">
                    <h2 className="font-bold text-[#22285E] text-lg mb-2">Workshop Stats</h2>
                    <StatCard title="ACTIVE PROJECTS" value="42 Units" percent="+12%" />
                    <StatCard title="COMPLETED" value="75%" percent="+05%" />
                    <StatCard title="TOTAL REVENUE" value="$ 12,450" percent="+10%" />
                    
                    <div className="pt-4">
                        <h2 className="font-bold text-[#22285E] text-lg mb-4">Stock Health</h2>
                        <div className="flex gap-4">
                            <div className="bg-[#9E4BDC] p-5 rounded-[25px] flex-1 text-white shadow-lg shadow-[#9E4BDC]/20">
                                <p className="text-[10px] font-bold opacity-60">SOFA</p>
                                <p className="text-sm font-bold">120 In Stock</p>
                            </div>
                            <div className="bg-[#95D5B6] p-5 rounded-[25px] flex-1 text-[#22285E]">
                                <p className="text-[10px] font-bold opacity-60">OAK TABLE</p>
                                <p className="text-sm font-bold">12 Low</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom 2: Banner & Production Flow */}
                <div className="col-span-6 space-y-8">
                    <div className="bg-[#9E4BDC] p-10 rounded-[30px] text-white flex justify-between items-center relative overflow-hidden shadow-2xl shadow-[#9E4BDC]/20">
                        <div className="z-10">
                            <h2 className="text-3xl font-bold mb-3 leading-tight">Mulai fitur<br />Workshop Premium!</h2>
                            <p className="text-white/60 text-[11px] max-w-xs leading-relaxed">Kelola pengrajin dan inventori kayu lebih efisien dengan sistem cloud.</p>
                            <button className="mt-8 bg-white text-[#9E4BDC] px-10 py-3 rounded-2xl font-bold text-xs hover:scale-105 transition-transform">Upgrade Now</button>
                        </div>
                        <div className="absolute top-0 right-0 w-72 h-full bg-white/5 skew-x-[-25deg]"></div>
                    </div>

                    <div className="bg-white p-8 rounded-[35px] shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-[#22285E]">Production Flow</h3>
                            <span className="text-[10px] bg-gray-100 px-4 py-1.5 rounded-full font-bold text-gray-500">Weekly</span>
                        </div>
                        <div className="h-44 w-full bg-gradient-to-t from-gray-50 to-transparent rounded-2xl flex items-end justify-around px-4 pb-2">
                             {/* Mockup Bar Chart */}
                             {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div key={i} style={{height: `${h}%`}} className="w-8 bg-[#9E4BDC]/20 rounded-t-lg hover:bg-[#9E4BDC] transition-colors cursor-pointer"></div>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Kolom 3: Craftsmen & Shipping */}
                <div className="col-span-3 space-y-8">
                    <div className="bg-white p-8 rounded-[35px] shadow-sm">
                        <h3 className="font-bold text-[#22285E] text-lg mb-8">Master Craftsmen</h3>
                        <div className="space-y-6">
                            <CraftItem name="Pak Slamet Jati" role="Master Woodworking" projects="120" color="bg-[#9E4BDC]" />
                            <CraftItem name="Pak Slamet Ukir" role="Master Carving" projects="85" color="bg-[#9E4BDC]" />
                            <CraftItem name="Est. Shipping" role="24 Shipments Today" projects="Active" color="bg-[#22285E]" icon={<MdLocalShipping />} />
                        </div>
                    </div>

                    <div className="bg-[#22285E] p-8 rounded-[35px] text-white relative overflow-hidden">
                        <p className="text-xs font-bold opacity-60 italic mb-2">Workshop Tip!</p>
                        <p className="text-[11px] leading-relaxed opacity-90">Pastikan kelembapan gudang kayu tetap di bawah 12% untuk hasil maksimal.</p>
                        <div className="mt-6 flex justify-between items-center">
                            <span className="text-xl font-bold">$45,200</span>
                            <button className="bg-[#9E4BDC] p-2 rounded-xl text-white">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components untuk kerapian kode
function StatCard({ title, value, percent }) {
    return (
        <div className="bg-white p-6 rounded-[25px] shadow-sm flex justify-between items-center border border-transparent hover:border-[#9E4BDC]/10 transition-all">
            <div>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{title}</p>
                <p className="text-xl font-bold text-[#22285E] mt-2">{value}</p>
            </div>
            <p className="text-[#9E4BDC] text-[10px] font-bold self-end mb-1">{percent} <FaArrowUp className="inline text-[8px]" /></p>
        </div>
    );
}

function CraftItem({ name, role, projects, color, icon }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg`}>
                {icon || <MdHandyman />}
            </div>
            <div>
                <p className="text-[13px] font-bold text-[#22285E]">{name}</p>
                <p className="text-[10px] text-gray-400 font-bold">{role} • {projects}</p>
            </div>
        </div>
    );
}