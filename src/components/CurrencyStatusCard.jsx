// src/components/CurrencyStatusCard.jsx
import CurrencyMiniCard from "./CurrencyMiniCard";

export default function CurrencyStatusCard() {
    return (
        <div className="flex flex-col gap-3 w-full">
            <h4 className="text-[14px] font-bold text-[#22285E]">Material Stock</h4>
            <div className="grid grid-cols-1 gap-3">
                <CurrencyMiniCard code="KAYU JATI PERHUTANI" fullValue="Grade A Premium" rate="142 Logs Ready" bgClass="bg-[#9E4BDC]" isUp={true} />
                <CurrencyMiniCard code="MAHOGANY WOOD" fullValue="Grade B Oven" rate="38 Logs (Low)" bgClass="bg-amber-700" isUp={false} />
            </div>
        </div>
    );
}