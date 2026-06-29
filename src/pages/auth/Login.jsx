import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate, Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import Logo from "../../assets/Logo.png";
import BackgroundWave from "../../assets/style.png";
import { authAPI } from "../../services/authAPI";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({ email: "", password: "" });

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
            const currentRole = (user.role || "member").toLowerCase(); 

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("activeUser", user.fullname || "User");
            localStorage.setItem("userRole", currentRole); 

            if (currentRole === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/member"); 
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Email atau Password salah! Cek kembali data Anda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-background font-poppins flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none -z-10">
                <img src={BackgroundWave} alt="Background Decor" className="h-full w-auto object-cover object-left" />
            </div>

            <div className="absolute -top-20 -right-20 w-80 h-80 border border-primary/20 rounded-full pointer-events-none -z-10"></div>

            <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
                <img src={Logo} alt="Logo" className="w-20 h-auto mb-4" />
                <h1 className="text-[30px] font-bold text-primary mb-8">Login</h1>

                {error && (
                    <div className="w-full mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-2 text-[12px] font-medium">
                        <BsFillExclamationDiamondFill className="shrink-0" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <input 
                        type="text" 
                        name="email" 
                        value={dataForm.email}
                        onChange={handleChange} 
                        placeholder="Username / Email" 
                        className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-xl text-shade text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text/60"
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={dataForm.password}
                        onChange={handleChange} 
                        placeholder="Password" 
                        className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-xl text-shade text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text/60"
                        required 
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="text-[11px] text-text">Keep me logged in</span>
                        </label>
                        <Link to="/forgot" className="text-[11px] text-primary font-semibold hover:underline">
                            Forgot Password!
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-primary hover:opacity-90 text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-primary/30 transition-all flex justify-center items-center text-sm"
                    >
                        {loading ? <ImSpinner2 className="animate-spin text-lg" /> : "Login"}
                    </button>
                </form>

                <div className="mt-8 flex justify-center gap-x-8">
                    <button className="flex items-center gap-2 text-[11px] text-text hover:text-shade">
                        <FaFacebook className="text-[#1877F2] text-lg" /> Login with facebook
                    </button>
                    <button className="flex items-center gap-2 text-[11px] text-text hover:text-shade">
                        <FcGoogle className="text-lg" /> Login with Google
                    </button>
                </div>

                <div className="mt-10 text-[13px] text-text">
                    Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Create now</Link>
                </div>
            </div>
        </div>
    );
}