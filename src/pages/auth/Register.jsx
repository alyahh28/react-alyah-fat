import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

import Logo from "../../assets/Logo.png";
import BackgroundWave from "../../assets/style.png";
// 🌟 Import service API yang telah dibuat
import { authAPI } from "../../services/authAPI";

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.fullName || !formData.email || !formData.password) {
            setError("Semua kolom formulir wajib diisi!");
            setLoading(false);
            return;
        }

        try {
            // 🌟 Jalankan query insert data user baru ke tabel Supabase via REST API
            await authAPI.registerUser({
                fullname: formData.fullName, // 👈 Menggunakan fullname sesuai skema database Supabase Anda
                email: formData.email,
                password: formData.password
            });

            // Jika sukses, arahkan ke login
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Pendaftaran gagal! Silakan periksa koneksi internet atau gunakan email lain.");
        } finally {
            loading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-background font-poppins flex items-center justify-center overflow-hidden">
            {/* Latar Belakang Gelombang */}
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none -z-10">
                <img src={BackgroundWave} alt="Background Decor" className="h-full w-auto object-cover object-left" />
            </div>
        
            {/* Dekorasi Lingkaran */}
            <div className="absolute -top-20 -right-20 w-80 h-80 border border-primary/20 rounded-full pointer-events-none -z-10"></div>

            <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
                {/* Logo & Judul Utama */}
                <img src={Logo} alt="Logo" className="w-20 h-auto mb-4" />
                <h1 className="text-[30px] font-bold text-primary mb-2 text-center">Join FurniCraft</h1>
                <p className="text-xs text-text/60 mb-6 text-center">Create account to manage your furniture orders.</p>
                
                {/* Kotak Pesan Error */}
                {error && (
                    <div className="w-full mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-2 text-[12px] font-medium">
                        <BsFillExclamationDiamondFill className="shrink-0" /> {error}
                    </div>
                )}

                {/* Formulir Pendaftaran */}
                <form onSubmit={handleRegister} className="w-full space-y-4">
                    <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name" 
                        className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-xl text-shade text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text/60"
                        required
                    />
                    
                    <input 
                        type="text" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Username / Email Address" 
                        className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-xl text-shade text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text/60"
                        required
                    />
                    
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password" 
                        className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-xl text-shade text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text/60"
                        required
                    />

                    {/* Tombol Kirim */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary hover:opacity-90 text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-primary/30 transition-all flex justify-center items-center text-sm"
                    >
                        {loading ? <ImSpinner2 className="animate-spin text-lg" /> : "Create Account"}
                    </button>
                </form>

                {/* Tautan Navigasi Kembali */}
                <div className="mt-10 text-[13px] text-text">
                    Already member? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    );
}