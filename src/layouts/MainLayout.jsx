import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
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