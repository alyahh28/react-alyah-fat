import { useState } from "react";
import { FaBell, FaSearch, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";

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
                        ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100 shadow-sm hover:shadow-md hover:border-amber-200'}`}
                >
                    <FaSearch className="text-stone-400 mr-3 text-sm" />
                    <span className="text-stone-400 text-sm font-medium">Search collections...</span>
                </div>
            </div>

            {/* MODAL SEARCH OVERLAY */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-start justify-center pt-24 z-[100]" onClick={() => setIsSearchOpen(false)}>
                    <div className="bg-white p-2 rounded-[40px] w-full max-w-2xl shadow-2xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center p-4 border-b border-stone-50">
                            <FaSearch className="text-amber-700 mr-4 text-xl" />
                            <input 
                                autoFocus 
                                className="w-full bg-transparent outline-none text-stone-800 text-lg font-medium placeholder:text-stone-300" 
                                placeholder="Cari furniture, kategori, atau pengrajin..." 
                            />
                        </div>
                        <div className="p-6">
                            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-4">Quick Links</p>
                            <div className="flex gap-2 flex-wrap">
                                {['Meja Jati', 'Kursi Kerja', 'Lemari', 'Pak Slamet'].map(tag => (
                                    <button key={tag} className="px-4 py-2 bg-stone-50 hover:bg-amber-50 hover:text-amber-800 rounded-2xl text-xs font-bold text-stone-500 transition-colors">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. ACTION BUTTONS & PROFILE */}
            <div className="flex items-center gap-3">
                
                {/* Dark Mode Toggle */}
                <button 
                    onClick={() => setIsDark(!isDark)}
                    className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all duration-300 border
                        ${isDark ? 'bg-amber-500 border-amber-400 text-stone-900' : 'bg-white border-stone-100 text-stone-500 hover:bg-stone-50 shadow-sm'}`}
                >
                    {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                </button>

                {/* Notifications */}
                <div className={`relative w-12 h-12 rounded-[20px] flex items-center justify-center cursor-pointer transition-all border
                    ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-100 text-stone-500 hover:bg-stone-50 shadow-sm'}`}>
                    <FaBell className="text-lg" />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </div>
                
                {/* Profile Section - Updated with assets/alyah.jpeg */}
                <div className={`flex items-center gap-3 p-1.5 pr-4 rounded-[24px] border ml-2 transition-all cursor-pointer
                    ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-100 shadow-sm hover:border-amber-200'}`}>
                    <div className="relative">
                        <img 
                            src="src/assets/alyah.jpeg" 
                            className="w-9 h-9 rounded-[18px] object-cover border-2 border-amber-100 shadow-sm" 
                            alt="Admin Alyah"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="hidden lg:block text-left leading-tight">
                        <p className="text-xs font-black text-stone-800 uppercase tracking-tighter">Alyah</p>
                        <p className="text-[10px] text-stone-400 font-bold">Store Admin</p>
                    </div>
                    <FaChevronDown className="text-[10px] text-stone-300 ml-1 group-hover:text-amber-600 transition-colors" />
                </div>
            </div>
        </div>
    );
}