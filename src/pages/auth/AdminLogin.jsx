import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/Logo.png";
import BackgroundWave from "../../assets/style.png";
import { authAPI } from "../../services/authAPI";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({ email: "", password: "", adminRole: "super_admin" });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const user = await authAPI.loginUser(dataForm.email, dataForm.password);
            
            // Force assign as admin in local storage even if DB says member, 
            // for the sake of letting them test without manual DB changes
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("activeUser", user.fullname || "Admin User");
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("adminSubRole", dataForm.adminRole); // super_admin, finansial, logistik

            // Catat login ke Audit Log
            const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
            auditLogs.push({
                id: Date.now(),
                admin: user.fullname || "Admin",
                role: dataForm.adminRole,
                action: "Login ke Control Panel",
                time: new Date().toLocaleString()
            });
            localStorage.setItem("audit_logs", JSON.stringify(auditLogs));

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.message || "Email atau Password salah!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-[#22285E] font-poppins flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none opacity-20">
                <img src={BackgroundWave} alt="Background Decor" className="h-full w-full object-cover object-left" />
            </div>

            <div className="z-10 w-full max-w-[420px] px-8 py-10 bg-white rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#9E4BDC] to-[#22285E]"></div>
                
                <img src={Logo} alt="Logo" className="w-16 h-auto mb-4" />
                <h1 className="text-2xl font-bold text-[#22285E] mb-2">FurinitureQ Control Panel</h1>
                <p className="text-gray-500 text-xs mb-8 text-center">Restricted Access. Authorized Personnel Only.</p>

                {error && (
                    <div className="w-full mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-2 text-[12px] font-medium">
                        <BsFillExclamationDiamondFill className="shrink-0" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <input 
                        type="email" 
                        name="email" 
                        value={dataForm.email}
                        onChange={handleChange} 
                        placeholder="Admin Email" 
                        className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#22285E]/50"
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={dataForm.password}
                        onChange={handleChange} 
                        placeholder="Password" 
                        className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#22285E]/50"
                        required 
                    />

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">Simulasi Hak Akses (RBAC):</label>
                        <select 
                            name="adminRole" 
                            value={dataForm.adminRole} 
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#22285E]/50"
                        >
                            <option value="super_admin">Super Admin (Akses Penuh)</option>
                            <option value="finansial">Divisi Finansial & Keuangan</option>
                            <option value="logistik">Divisi Logistik & Gudang</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#22285E] hover:opacity-90 text-white font-bold py-4 rounded-xl mt-6 shadow-lg transition-all flex justify-center items-center text-sm uppercase tracking-wider"
                    >
                        {loading ? <ImSpinner2 className="animate-spin text-lg" /> : "Secure Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
