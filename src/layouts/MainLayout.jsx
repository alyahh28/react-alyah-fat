import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    return (
        <div id="luxwood-app" className="bg-[#F9F9F7] min-h-screen flex font-poppins">
            <Sidebar />
            <div id="main-wrapper" className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto px-8 pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}