import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
// 1. Import file JSON lokal yang baru saja dibuat
import productsData from "../data/products.json";

export default function Courses() {
    return (
        <div className="p-4 animate-in fade-in duration-500">
            <PageHeader title="Product Collection" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* 2. Ganti array statis lama dengan mapping dari productsData */}
                {productsData.map((p) => (
                    <div key={p.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                        <div className="relative group overflow-hidden">
                            <img 
                                src={p.thumbnail} 
                                alt={p.title} 
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                {p.category}
                            </span>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <Link to={`/products/${p.id}`}>
                                    <h4 className="font-bold text-stone-800 text-lg hover:text-amber-800 transition-colors cursor-pointer line-clamp-1">
                                        {p.title}
                                    </h4>
                                </Link>
                                
                                {/* Format angka langsung ke format Rupiah Indonesia */}
                                <p className="text-amber-700 font-bold mt-1">
                                    Rp {p.price.toLocaleString('id-ID')}
                                </p>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6 text-xs text-stone-400 border-t border-stone-50 pt-4">
                                <span className="bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                                    Stock: <span className="text-stone-800 font-bold">{p.stock}</span>
                                </span>
                                
                                <Link 
                                    to={`/products/${p.id}`} 
                                    className="bg-stone-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-800 transition-all shadow-sm text-[11px]"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}