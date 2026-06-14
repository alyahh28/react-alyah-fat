// src/layouts/GuestLayout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";

const GuestLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Jika di halaman landing, hanya render konten tanpa nav & footer
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  // Untuk halaman guest lainnya, tampilkan nav & footer seperti biasa
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar khusus Guest */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-xl text-slate-800">Alyah Apps</span>
          <div className="hidden md:flex space-x-6 text-slate-600 font-medium">
            <Link to="/guest" className="hover:text-indigo-600 transition">
              Beranda
            </Link>
            <Link to="/guest/courses" className="hover:text-indigo-600 transition">
              Kursus Publik
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Masuk
            </Link>
            <Link
              to="/auth/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Alyah Apps. Mode Pengunjung (Guest Mode).
      </footer>
    </div>
  );
};

export default GuestLayout;