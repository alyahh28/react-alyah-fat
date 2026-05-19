// src/components/dashboard/MiningStatusItem.jsx
import ToggleSwitch from "../components/ToggleSwitch";

export default function MiningStatusItem({ icon, iconBg, title, subtitle, hasToggle = true }) {
    return (
        <div className="flex items-center justify-between py-2 w-full">
            <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white ${iconBg}`}>
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#22285E]">{title}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{subtitle}</span>
                </div>
            </div>
            {hasToggle ? <ToggleSwitch /> : <span className="text-gray-400 text-sm">➔</span>}
        </div>
    );
}