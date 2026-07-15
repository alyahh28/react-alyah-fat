import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillCheckCircleFill, BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

import Logo from "../../assets/Logo.png";
import BackgroundWave from "../../assets/style.png";
import { authAPI } from "../../services/authAPI";

export default function Forgot() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({ email: "", newPassword: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await authAPI.resetPassword(formData.email);
            setSuccess("Email petunjuk reset password telah dikirim ke alamat email Anda! Silakan periksa inbox.");
            
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.error(err);
            setError(err.message || "Gagal mengirim email reset sandi. Silakan periksa kembali email Anda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-background font-poppins flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none -z-10">
                <img src={BackgroundWave} alt="Background Decor" className="h-full w-auto object-cover object-left" />
            </div>

            <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
                <img src={Logo} alt="Logo" className="w-20 h-auto mb-4" />
                <h1 className="text-[26px] font-bold text-primary mb-2 text-center">Reset Password</h1>
                <p className="text-xs text-text/70 mb-6 text-center">Ubah kata sandi akun Supabase FurnitureQ Anda.</p>

                {error && (
                    <div className="w-full mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-2 text-[12px] font-medium">
                        <BsFillExclamationDiamondFill className="shrink-0" /> {error}
                    </div>
                )}

                {success && (
                    <div className="w-full mb-4 p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center gap-2 text-[12px] font-medium">
                        <BsFillCheckCircleFill className="shrink-0" /> {success}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="w-full space-y-4">
                    <input 
                        type="text" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan Email / Username Terdaftar" 
                        className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-xl text-shade text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text/60"
                        required 
                    />
                    <input 
                        type="password" 
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Masukkan Password Baru Anda" 
                        className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-xl text-shade text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text/60"
                        required 
                    />

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-primary hover:opacity-90 text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-primary/30 transition-all flex justify-center items-center text-sm"
                    >
                        {loading ? <ImSpinner2 className="animate-spin text-lg" /> : "Update Password"}
                    </button>
                </form>

                <div className="mt-8 text-[13px] text-text">
                    Ingat password Anda? <Link to="/login" className="text-primary font-bold hover:underline">Login kembali</Link>
                </div>
            </div>
        </div>
    );
}