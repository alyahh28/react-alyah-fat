import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");

        if (!formData.fullName || !formData.email || !formData.password) {
            setError("Semua kolom formulir wajib diisi!");
            return;
        }

        // Simpan data akun pendaftaran secara lokal ke localStorage
        localStorage.setItem("userAccount", JSON.stringify(formData));

        // Setelah berhasil mendaftar, otomatis arahkan ke halaman login
        navigate("/login");
    };

    return (
        <div className="w-full max-w-[360px] mx-auto p-4">
            <h2 className="text-2xl font-bold text-stone-800 mb-2 text-center">Join LuxWood</h2>
            <p className="text-sm text-stone-500 mb-6 text-center">Create account to manage your furniture orders.</p>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-600 outline-none" 
                        placeholder="John Doe" 
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Email Address / Username</label>
                    <input 
                        type="text" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-600 outline-none" 
                        placeholder="john@example.com atau john123" 
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••" 
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-600 outline-none" 
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl mt-4 transition-all text-sm shadow-md">
                    Create Account
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500">
                Already member? <Link to="/login" className="text-amber-700 font-bold hover:underline">Login here</Link>
            </p>
        </div>
    );
}