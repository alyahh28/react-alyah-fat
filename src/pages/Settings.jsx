import PageHeader from "../components/PageHeader";

export default function Settings() {
    return (
        <div className="p-4">
            <PageHeader title="Store Settings" />
            
            <div className="max-w-2xl mt-6 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                {/* Profile Section */}
                <div className="mb-8 flex items-center gap-6">
                    <img 
                        src="https://i.pravatar.cc/150?u=admin" 
                        className="w-20 h-20 rounded-2xl ring-4 ring-amber-100 object-cover" 
                        alt="Admin Profile"
                    />
                    <div>
                        <button className="bg-amber-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-900 transition">
                            Change Photo
                        </button>
                        <p className="text-xs text-stone-400 mt-2">Format JPG atau PNG. Maksimal 2MB.</p>
                    </div>
                </div>

                {/* Form Section menggunakan Input HTML Biasa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Store Name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none transition-all" 
                            placeholder="FurnitureQ Furniture" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Admin Email</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none transition-all" 
                            placeholder="admin@FurnitureQ.com" 
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Store Address</label>
                    <textarea 
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none transition-all" 
                        rows="3" 
                        placeholder="Jl. Kayu Jati No. 12, Jepara, Jawa Tengah"
                    ></textarea>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-50">
                    <button className="bg-stone-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-stone-700 transition shadow-lg active:scale-95">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}