import { Link } from "react-router-dom";
import { useState } from "react";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    return (
        <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2 text-center">Reset Password</h2>
            <p className="text-sm text-stone-500 mb-8 text-center px-4">
                Masukkan email terdaftar untuk menerima instruksi pemulihan.
            </p>

            {!isSent ? (
                <form onSubmit={(e) => { e.preventDefault(); setIsSent(true); }} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none transition-all" 
                            placeholder="admin@luxwood.com" 
                        />
                    </div>
                    <button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
                        Send Recovery Link
                    </button>
                </form>
            ) : (
                <div className="bg-amber-50 p-6 rounded-2xl text-center border border-amber-100 animate-fade-in">
                    <div className="text-amber-800 font-bold mb-2">Link Terkirim!</div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                        Kami telah mengirimkan tautan reset password ke <b>{email}</b>. Silakan periksa kotak masuk atau folder spam anda.
                    </p>
                </div>
            )}

            <div className="mt-8 text-center">
                <Link to="/auth/login" className="text-sm text-amber-700 font-bold hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}