import axios from "axios";
import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate, Link } from "react-router-dom";

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

        axios.post("https://dummyjson.com/user/login", {
            username: dataForm.email, // dummyjson menggunakan username
            password: dataForm.password,
        })
        .then(() => {
            navigate("/");
        })
        .catch((err) => {
            setError(err.response?.data?.message || "Login gagal, cek kembali data anda.");
        })
        .finally(() => setLoading(false));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-6 text-center">Welcome Back</h2>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <BsFillExclamationDiamondFill /> {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Username / Email</label>
                    <input type="text" name="email" onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none" placeholder="emilys" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
                    <input type="password" name="password" onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none" placeholder="••••••••" required />
                </div>
                <div className="flex justify-end">
                    <Link to="/auth/forgot" className="text-xs text-amber-700 hover:underline">Forgot Password?</Link>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center">
                    {loading ? <ImSpinner2 className="animate-spin text-xl" /> : "Sign In"}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500">
                Don't have an account? <Link to="/auth/register" className="text-amber-700 font-bold hover:underline">Register</Link>
            </p>
        </div>
    );
}