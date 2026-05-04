import { useState } from "react";
import { FaBell, FaSearch, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";
// Import ini dipakai jika folder assets ada di dalam folder src
import alyahPhoto from "../assets/alyah.jpeg"; 

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    return (
        <div className={`flex justify-between items-center py-4 px-2 transition-all duration-500 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            
            {/* 1. SEARCH BAR */}
            <div className="relative group w-full max-w-md">
                <div 
                    onClick={() => setIsSearchOpen(true)}
                    className={`flex items-center px-5 py-3 rounded-[24px] cursor-pointer transition-all duration-300 border
                        ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100 shadow-sm hover:shadow-md'}`}
                >
                    <FaSearch className="text-stone-400 mr-3 text-sm" />
                    <span className="text-stone-400 text-sm font-medium">Cari katalog furniture premium...</span>
                </div>
            </div>

            {/* ACTION BUTTONS & PROFILE */}
            <div className="flex items-center gap-3">
                <button onClick={() => setIsDark(!isDark)} className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all border ${isDark ? 'bg-amber-500 border-amber-400 text-stone-900' : 'bg-white border-stone-100 text-stone-500 shadow-sm'}`}>
                    {isDark ? <FaSun /> : <FaMoon />}
                </button>

                <div className={`relative w-12 h-12 rounded-[20px] flex items-center justify-center cursor-pointer border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100 shadow-sm'}`}>
                    <FaBell />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </div>
                
                <div className={`flex items-center gap-3 p-1.5 pr-4 rounded-[24px] border ml-2 transition-all ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100 shadow-sm'}`}>
                    <div className="relative">
                        <img 
                            src={alyahPhoto} 
                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Alyah+Woody&background=random"; }}
                            className="w-9 h-9 rounded-[18px] object-cover border-2 border-amber-100 shadow-sm" 
                            alt="Admin Alyah"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="hidden lg:block text-left leading-tight">
                        <p className="text-xs font-black text-stone-800 uppercase tracking-tighter">Alyah Woody</p>
                        <p className="text-[10px] text-stone-400 font-bold">Store Admin</p>
                    </div>
                    <FaChevronDown className="text-[10px] text-stone-300 ml-1" />
                </div>
            </div>
        </div>
    );
}