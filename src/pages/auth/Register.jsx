import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2 text-center">Join LuxWood</h2>
            <p className="text-sm text-stone-500 mb-6 text-center">Create account to manage your furniture orders.</p>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
                    <input type="email" className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none" placeholder="john@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none" />
                </div>
                <button className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl mt-4 transition-all">
                    Create Account
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500">
                Already member? <Link to="/auth/login" className="text-amber-700 font-bold hover:underline">Login here</Link>
            </p>
        </div>
    );
}