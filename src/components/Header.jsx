import { FaSearch, FaUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import ProfileImage from "../assets/alyah.jpeg"; 

export default function Header({ pageTitle = "Dashboard" }) {
    return (
        <div className="flex justify-between items-center py-6 px-4 bg-transparent font-poppins w-full">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-[#22285E] text-2xl">
                    <HiMenuAlt2 />
                </button>
                <h1 className="text-[28px] font-bold text-[#22285E] leading-none tracking-tight">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-5">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-[#F2F2F2] px-6 py-3.5 rounded-[20px] w-[300px]">
                    <FaSearch className="text-[#9E4BDC] mr-3 text-lg" />
                    <input 
                        type="text" 
                        placeholder="Cari sesuatu..." 
                        className="bg-transparent border-none outline-none text-[13px] text-[#22285E] w-full font-medium"
                    />
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-[14px] font-bold text-[#22285E] leading-tight">Alyah Najwa</p>
                        <p className="text-[11px] text-[#7A7E9E] font-semibold uppercase tracking-wider">Administrator</p>
                    </div>
                    <div className="relative">
                        <img 
                            src={ProfileImage} 
                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Alyah+Najwa&background=9E4BDC&color=fff"; }}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" 
                            alt="Alya"
                        />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4BDC9E] border-2 border-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}