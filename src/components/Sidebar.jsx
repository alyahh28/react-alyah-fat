import { MdDashboard, MdOutlineChair, MdMessage, MdSettings } from "react-icons/md";
import { FaUsers, FaRocket, FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const menuClass = ({ isActive }) =>
        `flex items-center rounded-2xl p-4 space-x-3 transition-all duration-300
        ${isActive ? "text-amber-900 bg-amber-50 font-bold shadow-sm" : "text-stone-400 hover:text-amber-800 hover:bg-stone-50"}`;

    return (
        <div className="flex min-h-screen w-72 flex-col bg-white p-6 border-r border-stone-100 sticky top-0">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-amber-800 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-amber-200">L</div>
                <span className="font-bold text-xl text-stone-800 tracking-tight">LuxWood</span>
            </div>

            {/* Menu Navigasi */}
            <nav className="flex flex-col space-y-2 flex-1">
                <NavLink to="/" className={menuClass}><MdDashboard className="text-2xl" /> <span>Overview</span></NavLink>
                <NavLink to="/products" className={menuClass}><MdOutlineChair className="text-2xl" /> <span>Collections</span></NavLink>
                <NavLink to="/craftsmen" className={menuClass}><FaUsers className="text-2xl" /> <span>Craftsmen</span></NavLink>
                <NavLink to="/messages" className={menuClass}><MdMessage className="text-2xl" /> <span>Message</span></NavLink>
                <NavLink to="/settings" className={menuClass}><MdSettings className="text-2xl" /> <span>Settings</span></NavLink>
            </nav>

            {/* UPGRADE PRO CARD */}
            <div className="mt-auto bg-stone-900 rounded-[32px] p-6 relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-600/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                    <p className="text-white font-bold text-lg leading-tight">Upgrade<br />to Pro</p>
                    <p className="text-stone-500 text-[10px] mt-2 mb-4">Dapatkan akses fitur inventory premium.</p>
                    <button className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                        <FaRocket className="animate-bounce" /> Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
}