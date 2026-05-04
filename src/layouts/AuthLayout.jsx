import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-stone-200">
                <div className="flex flex-col items-center justify-center mb-8">
                    <h1 className="text-4xl font-serif font-black text-stone-900">
                        LuxWood<span className="text-amber-700">.</span>
                    </h1>
                    <p className="text-stone-400 text-sm mt-2">Furniture Management System</p>
                </div>

                <Outlet/>

                <p className="text-center text-xs text-stone-400 mt-8">
                    © 2025 LuxWood Furniture. All rights reserved.
                </p>
            </div>
        </div>
    );
}