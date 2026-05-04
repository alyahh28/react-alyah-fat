import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-center p-6">
            <h1 className="text-9xl font-black text-stone-200">404</h1>
            <p className="text-2xl font-bold text-stone-800 -mt-8">Koleksi Tidak Ditemukan</p>
            <p className="text-stone-500 mt-2 mb-8">Maaf, halaman furniture yang anda cari tidak tersedia.</p>
            <Link to="/" className="bg-amber-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-amber-900 transition-all">
                Kembali ke Dashboard
            </Link>
        </div>
    );
}