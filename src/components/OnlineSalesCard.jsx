// src/components/OnlineSalesCard.jsx
export default function OnlineSalesCard() {
    return (
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex flex-col gap-4">
            <div>
                <h4 className="text-[14px] font-bold text-[#9E4BDC]">Kategori Produksi</h4>
                <p className="text-[11px] text-gray-400 font-medium">Persentase furniture yang dibuat</p>
            </div>
            
            <div className="flex justify-center my-2">
                <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-inner relative"
                     style={{ background: 'conic-gradient(#9E4BDC 45%, #F43F5E 45% 75%, #34D399 75%)' }}>
                    <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Kursi/Sofa</span>
                        <span className="text-sm font-bold text-[#9E4BDC]">45%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}