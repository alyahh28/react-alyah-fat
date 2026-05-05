import { MdDashboard, MdOutlineChair, MdShoppingCart, MdPeople, MdHandyman, MdMessage, MdSettings, MdHelp } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png"; 

export default function Sidebar() {
    // Styling menu mengikuti anatomi template (Putih saat aktif, Transparan saat tidak)
    const menuClass = ({ isActive }) =>
        `flex items-center rounded-[18px] px-6 py-3.5 space-x-4 transition-all duration-300 
        ${isActive 
            ? "text-[#9E4BDC] bg-white shadow-lg font-bold" 
            : "text-white/70 hover:text-white hover:bg-white/10 font-medium"}`;

    return (
        <div className="flex min-h-screen w-64 shrink-0 flex-col bg-[#9E4BDC] p-6 sticky top-0 z-40 font-poppins rounded-r-[40px] shadow-2xl">
            {/* Bagian Logo - Mengikuti gaya template dengan latar transparan putih */}
            <div className="flex justify-center mb-16 mt-4">
                <div className="bg-white/20 p-4 rounded-[22px] backdrop-blur-sm">
                    <img src={Logo} alt="Logo" className="w-10 h-10 object-contain invert brightness-0" />
                </div>
            </div>

            {/* Navigasi Menu - Isian mengikuti dashboard furniture lama kamu */}
            <nav className="flex flex-col space-y-2 flex-1">
                <NavLink to="/" className={menuClass}>
                    <MdDashboard className="text-xl" /> <span>Dashboard</span>
                </NavLink>
                <NavLink to="/products" className={menuClass}>
                    <MdOutlineChair className="text-xl" /> <span>Collections</span>
                </NavLink>
                <NavLink to="/orders" className={menuClass}>
                    <MdShoppingCart className="text-xl" /> <span>Orders</span>
                </NavLink>
                <NavLink to="/customers" className={menuClass}>
                    <MdPeople className="text-xl" /> <span>Customers</span>
                </NavLink>
                <NavLink to="/craftsmen" className={menuClass}>
                    <MdHandyman className="text-xl" /> <span>Craftsmen</span>
                </NavLink>
                <NavLink to="/messages" className={menuClass}>
                    <MdMessage className="text-xl" /> <span>Messages</span>
                </NavLink>

                {/* Bagian Bawah (Settings & Help) sesuai template */}
                <div className="pt-10 space-y-2 border-t border-white/10 mt-6">
                    <NavLink to="/settings" className={menuClass}>
                        <MdSettings className="text-xl" /> <span>Settings</span>
                    </NavLink>
                    <NavLink to="/help" className={menuClass}>
                        <MdHelp className="text-xl" /> <span>Help</span>
                    </NavLink>
                    
                    {/* Tombol Log Out dengan gaya template */}
                    <button className="flex items-center w-full px-6 py-3.5 space-x-4 text-white/70 font-medium hover:text-white transition-all mt-4 group">
                        <span className="rotate-180 text-xl font-bold group-hover:-translate-x-1 transition-transform">➔</span> 
                        <span>Log Out</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}   