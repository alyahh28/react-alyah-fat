import PageHeader from "../components/PageHeader";

export default function Courses() {
    const products = [
        { id: 1, name: "Meja Jati Minimalis", price: "Rp 2.500.000", stock: 12, img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300" },
        { id: 2, name: "Kursi Kerja Ergonomis", price: "Rp 1.200.000", stock: 45, img: "https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?w=300" },
    ];

    return (
        <div className="p-4">
            <PageHeader title="Product Collection" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {products.map(p => (
                    <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100">
                        <img src={p.img} alt={p.name} className="w-full h-48 object-cover" />
                        <div className="p-5">
                            <h4 className="font-bold text-stone-800 text-lg">{p.name}</h4>
                            <p className="text-amber-700 font-bold mt-1">{p.price}</p>
                            <div className="flex justify-between items-center mt-4 text-xs text-stone-400">
                                <span>Stock: {p.stock} units</span>
                                <button className="text-stone-800 font-bold hover:underline">Edit Detail</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}