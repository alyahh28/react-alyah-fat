import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { authAPI } from "../services/authAPI";

export default function MainLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        let timeout;

        const handleActivity = () => {
            clearTimeout(timeout);
            // 15 minutes = 15 * 60 * 1000 = 900000 ms
            timeout = setTimeout(async () => {
                await authAPI.logoutUser();
                navigate("/admin/control-panel");
            }, 900000);
        };

        // Initialize timeout
        handleActivity();

        // Listen for user activity
        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);
        window.addEventListener("scroll", handleActivity);
        window.addEventListener("click", handleActivity);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
            window.removeEventListener("scroll", handleActivity);
            window.removeEventListener("click", handleActivity);
        };
    }, [navigate]);

    return (
        // flex memastikan Sidebar di kiri dan Konten di kanan
        <div className="flex min-h-screen bg-[#FDFDFF]">
            
            {/* 1. Sidebar dengan lebar tetap */}
            <Sidebar />

            {/* 2. Area Konten Utama */}
            <main className="flex-1 min-w-0 overflow-x-hidden">
                {/* Outlet adalah tempat Dashboard muncul */}
                <Outlet />
            </main>
            
        </div>
    );
}