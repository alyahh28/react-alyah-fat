// src/components/MiningStatusCard.jsx
import MiningStatusItem from "./MiningStatusItem";
import { MdHandyman, MdEngineering, MdOutlineLocalShipping } from "react-icons/md";
import { FaUserTie, FaUsers } from "react-icons/fa";

export default function MiningStatusCard() {
    return (
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex flex-col gap-4">
            <div>
                <h4 className="text-[14px] font-bold text-[#22285E]">Master Craftsmen</h4>
                <p className="text-[11px] text-gray-400">Manajemen status kerja tukang kayu</p>
            </div>
            <div className="flex flex-col gap-3 divide-y divide-gray-50">
                <MiningStatusItem icon={<MdHandyman />} iconBg="bg-purple-500" title="Pak Slamet Jati" subtitle="Master Woodworking (Aktif)" />
                <MiningStatusItem icon={<MdEngineering />} iconBg="bg-indigo-400" title="Pak Slamet Ukir" subtitle="Master Carving (Oven Room)" hasToggle={false} />
                <MiningStatusItem icon={<MdOutlineLocalShipping />} iconBg="bg-slate-900" title="Tim Logistik" subtitle="24 Pengiriman Hari Ini" />
                <MiningStatusItem icon={<FaUserTie />} iconBg="bg-purple-400" title="Quality Control" subtitle="Pengecekan Akhir Finishing" />
                <MiningStatusItem icon={<FaUsers />} iconBg="bg-emerald-400" title="Total Helper" subtitle="12 Orang Standby" />
            </div>
        </div>
    );
}