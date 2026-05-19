// src/components/common/ToggleSwitch.jsx
import { useState } from "react";

export default function ToggleSwitch({ defaultChecked = true }) {
    const [enabled, setEnabled] = useState(defaultChecked);
    return (
        <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${enabled ? 'bg-[#9E4BDC]' : 'bg-gray-200'}`}
        >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
        </button>
    );
}