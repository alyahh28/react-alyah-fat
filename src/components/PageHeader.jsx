import { FaPlus } from "react-icons/fa";

export default function PageHeader(props) {
    return (
        <div id="pageheader-container" className="flex items-center justify-between p-4 mb-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="pageheader-title" className="text-3xl font-bold text-stone-800">
                    {props.title}
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-1 text-sm">
                    <span className="text-slate-400">Management</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-[#9E4BDC]">{props.title}</span>
                </div>
            </div>
            {props.onAddClick && (
                <div id="action-button">
                    <button 
                        onClick={props.onAddClick}
                        className="flex items-center bg-[#9E4BDC] text-white px-5 py-2.5 rounded-xl hover:bg-[#8A3BCA] transition-all shadow-lg shadow-[#9E4BDC]/20 active:scale-95 text-sm font-bold"
                    >
                        <FaPlus className="mr-2 text-sm" />
                        <span>Tambah {props.title}</span>
                    </button>
                </div>
            )}
        </div>
    );
}