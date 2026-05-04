import { useState } from "react";
import { FaStar, FaChevronRight, FaPlay, FaCircle } from "react-icons/fa";

export default function Dashboard() {
    // 1. Data Grafik Production Flow (MON - SUN)
    const productionData = [
        { day: "Mon", value: 45 },
        { day: "Tue", value: 72 },
        { day: "Wed", value: 38 },
        { day: "Thu", value: 85 }, // Puncak
        { day: "Fri", value: 55 },
        { day: "Sat", value: 40 },
        { day: "Sun", value: 65 },
    ];

    // 2. Konfigurasi SVG untuk Grafik Garis
    const svgWidth = 500; // Lebar kanvas SVG
    const svgHeight = 150; // Tinggi kanvas SVG
    const padding = 20;   // Padding agar poin tidak mentok ke pinggir

    // Menghitung koordinat (X, Y) untuk setiap poin data
    const points = productionData.map((item, index) => {
        // Menghitung X: Jarak horizontal antar poin
        const x = padding + (index * (svgWidth - 2 * padding)) / (productionData.length - 1);
        // Menghitung Y: Dibalik (karena SVG Y=0 ada di atas). Persentase nilai menentukan tinggi.
        const y = svgHeight - padding - (item.value / 100) * (svgHeight - 2 * padding);
        return { x, y, day: item.day, value: item.value };
    });

    // Membuat string koordinat untuk atribut 'points' pada <polyline> (format: "x1,y1 x2,y2 ...")
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");

    // State untuk menampilkan tooltip saat hover poin
    const [hoveredPoint, setHoveredPoint] = useState(null);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- KOLOM UTAMA (KIRI & TENGAH) --- */}
            <div className="flex-1 min-w-0">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-stone-800">Hi, Admin Woody 👋</h1>
                    <p className="text-stone-400 mt-1">Workshop kamu hari ini berjalan dengan baik.</p>
                </header>

                {/* Grid Statistik Atas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Circle Progress Card (Tetap Sama) */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 flex items-center justify-between">
                        <div>
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Active Projects</p>
                            <h2 className="text-5xl font-black text-stone-800">42</h2>
                            <div className="mt-4 inline-flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black">
                                75% COMPLETED
                            </div>
                        </div>
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-stone-100" strokeWidth="4"></circle>
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-amber-600" strokeWidth="4" strokeDasharray="75, 100" strokeLinecap="round"></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-stone-800">75%</div>
                        </div>
                    </div>

                    {/* 3. Update UPDATE: LINE CHART Production Flow */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 relative">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Production Flow</p>
                            <select className="text-[10px] font-bold text-stone-500 bg-stone-50 px-2 py-1 rounded-lg outline-none cursor-pointer border border-stone-100">
                                <option>This Week</option>
                                <option>Last Week</option>
                            </select>
                        </div>
                        
                        {/* Container SVG Grafik Garis */}
                        <div className="relative" style={{ height: `${svgHeight}px` }}>
                            <svg 
                                width="100%" 
                                height="100%" 
                                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                                preserveAspectRatio="none"
                                className="overflow-visible"
                            >
                                {/* Menggambar Garis (Polyline) */}
                                <polyline
                                    fill="none"
                                    className="stroke-amber-600"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={polylinePoints}
                                />

                                {/* Menggambar Titik-Titik (Poin Data) */}
                                {points.map((point, i) => (
                                    <g key={i} className="group cursor-pointer">
                                        {/* Lingkaran transparan yang lebih besar agar mudah di-hover */}
                                        <circle 
                                            cx={point.x} 
                                            cy={point.y} 
                                            r="12" 
                                            fill="transparent"
                                            onMouseEnter={() => setHoveredPoint(point)}
                                            onMouseLeave={() => setHoveredPoint(null)}
                                        />
                                        {/* Lingkaran Poin Visual */}
                                        <circle 
                                            cx={point.x} 
                                            cy={point.y} 
                                            r={point.day === "Thu" ? "6" : "5"} // Puncak sedikit lebih besar
                                            className={`${point.day === "Thu" ? 'fill-amber-800' : 'fill-white'} stroke-amber-600 transition-all group-hover:r-7`}
                                            strokeWidth="3"
                                        />
                                    </g>
                                ))}
                            </svg>
                            
                            {/* Tooltip Kustom saat Hover Poin */}
                            {hoveredPoint && (
                                <div 
                                    className="absolute bg-stone-900 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-xl pointer-events-none z-20 animate-fade-in"
                                    style={{ 
                                        left: `${(hoveredPoint.x / svgWidth) * 100}%`, 
                                        top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                                        transform: 'translate(-50%, -130%)' // Posisi di atas poin
                                    }}
                                >
                                    {hoveredPoint.value} Unit
                                    {/* Panah Tooltip */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-stone-900"></div>
                                </div>
                            )}
                        </div>

                        {/* Label Hari di Bawah Grafik */}
                        <div className="flex justify-between items-center mt-3 px-1">
                            {productionData.map(item => (
                                <span key={item.day} className={`text-[9px] font-black uppercase tracking-wider 
                                    ${item.day === "Thu" ? 'text-amber-800' : 'text-stone-300'}`}>
                                    {item.day}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section Expert Craftsmen (Tetap Sama) */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-stone-800 text-xl">Top Master Craftsmen</h3>
                        <button className="text-amber-800 text-sm font-bold hover:underline">View all experts</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white p-5 rounded-3xl flex items-center gap-4 border border-stone-50 hover:shadow-md transition-shadow">
                                <img src={`https://i.pravatar.cc/150?u=expert${i}`} className="w-14 h-14 rounded-2xl object-cover" alt="expert" />
                                <div className="flex-1">
                                    <p className="font-bold text-stone-800">Pak Slamet {i === 1 ? 'Jati' : 'Ukir'}</p>
                                    <p className="text-xs text-stone-400">Master Woodworking</p>
                                    <div className="flex items-center text-[11px] text-amber-500 font-bold mt-1"><FaStar className="mr-1" /> 4.9 (120 Projects)</div>
                                </div>
                                <button className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 hover:text-amber-800 hover:bg-amber-50 transition-colors"><FaChevronRight /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Furniture (Tetap Sama) */}
                <div>
                    <h3 className="font-bold text-stone-800 text-xl mb-6">Trending Furniture</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-[40px] border border-stone-100 group">
                            <div className="relative overflow-hidden rounded-[32px] mb-4 shadow-inner">
                                <img src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500" className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-700" alt="product" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-stone-800">LIMITED</div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-stone-800">Minimalist Oak Desk</h4>
                                    <p className="text-amber-800 font-black mt-1">Rp 4.200.000</p>
                                </div>
                                <button className="bg-stone-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-amber-700 transition-colors shadow-lg"><FaPlay className="text-[10px] ml-0.5" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- KOLOM KANAN (SIDE PANEL) (Tetap Sama) --- */}
            <div className="w-full lg:w-80 space-y-6">
                {/* Kalender */}
                <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-stone-800">April 2025</h3>
                        <div className="flex gap-2">
                            <button className="w-6 h-6 border border-stone-200 rounded-md text-[10px] flex items-center justify-center hover:bg-stone-50">{"<"}</button>
                            <button className="w-6 h-6 border border-stone-200 rounded-md text-[10px] flex items-center justify-center hover:bg-stone-50">{">"}</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-8">
                        {['S','M','T','W','T','F','S'].map(day => <div key={day} className="text-[10px] text-stone-300 font-bold text-center">{day}</div>)}
                        {[12,13,14,15,16,17,18].map(d => (
                            <div key={d} className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl cursor-pointer transition-all
                                ${d === 15 ? 'bg-amber-800 text-white shadow-lg' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-800'}`}>
                                {d}
                            </div>
                        ))}
                    </div>
                    <h4 className="font-bold text-stone-800 text-sm mb-4">Today Schedule</h4>
                    <div className="space-y-4">
                        <div className="relative pl-6 border-l-2 border-amber-600 py-1">
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">09:00 AM</p>
                            <p className="text-xs font-bold text-stone-800">QC Meja Jati Premium</p>
                        </div>
                        <div className="relative pl-6 border-l-2 border-stone-200 py-1">
                            <p className="text-[10px] font-black text-stone-300 uppercase tracking-tighter">02:30 PM</p>
                            <p className="text-xs font-bold text-stone-400">Meeting Supplier Kayu</p>
                        </div>
                    </div>
                </div>
                {/* Workshop Tip */}
                <div className="bg-stone-900 p-6 rounded-[40px] border border-stone-800 shadow-xl PromoCard">
                    <p className="text-amber-500 font-bold text-sm">Workshop Tip!</p>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">Pastikan kelembaban gudang kayu tetap di bawah <span className="text-white">12%</span> untuk hasil maksimal.</p>
                </div>
            </div>
        </div>
    );
}