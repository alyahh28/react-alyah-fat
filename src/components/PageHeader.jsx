import { FaPlus } from "react-icons/fa";

export default function PageHeader(props) {
    return (
        <div id="pageheader-container" className="flex items-center justify-between p-4 mb-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="pageheader-title" className="text-3xl font-bold text-stone-800">
                    {props.title}
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-1">
                    <span className="text-stone-400">Management</span>
                    <span className="text-stone-300">/</span>
                    <span className="text-amber-700">{props.title}</span>
                </div>
            </div>
            <div id="action-button">
                <button 
                    onClick={props.onAddClick}
                    className="flex items-center bg-amber-800 text-white px-5 py-2.5 rounded-xl hover:bg-amber-900 transition-all shadow-lg shadow-amber-900/20 active:scale-95"
                >
                    <FaPlus className="mr-2 text-sm" />
                    <span>Tambah {props.title}</span>
                </button>
            </div>
        </div>
    );
}