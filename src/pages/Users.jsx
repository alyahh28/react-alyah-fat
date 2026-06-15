import { useState, useEffect } from "react";
import { MdSearch, MdSupervisorAccount, MdRefresh } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { authAPI } from "../services/authAPI"; // 👈 Sesuaikan arah import path ke berkas authAPI Anda

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fungsi memuat data dari Supabase via Axios Service
  const fetchUsersData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await authAPI.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data pengguna dari database Supabase.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  // Filter pencarian nama atau email secara langsung di client-side
  const filteredUsers = users.filter((user) => {
    const fullNameLower = (user.fullname || "").toLowerCase();
    const emailLower = (user.email || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullNameLower.includes(query) || emailLower.includes(query);
  });

  return (
    <div className="p-8 w-full font-poppins bg-slate-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <MdSupervisorAccount className="text-[#9E4BDC]" /> Registered Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau dan kelola seluruh akun pengguna yang terdaftar di sistem basis data FurniCraft.
          </p>
        </div>

        <button 
          onClick={fetchUsersData}
          className="flex items-center gap-2 self-start bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition"
        >
          <MdRefresh className={`text-lg ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full max-w-md flex items-center">
          <MdSearch className="absolute left-4 text-slate-400 text-xl pointer-events-none" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 focus:border-[#9E4BDC] transition-all"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 sm:ml-auto">
          Total Terdisplay: <span className="text-[#9E4BDC] text-sm font-bold">{filteredUsers.length}</span> Pengguna
        </div>
      </div>

      {/* ERROR MESSAGE HANDLING */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium mb-6">
          {error}
        </div>
      )}

      {/* MAIN DATA TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <ImSpinner2 className="animate-spin text-4xl text-[#9E4BDC]" />
            <p className="text-sm font-medium">Menghubungkan ke tabel Supabase...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-base font-medium">Tidak ada data pengguna yang cocok atau ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-6 text-center w-16">No</th>
                  <th className="py-4 px-6">Nama Lengkap</th>
                  <th className="py-4 px-6">Email / Username</th>
                  <th className="py-4 px-6">ID Pengguna</th>
                  <th className="py-4 px-6 text-center">Status Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 text-center text-slate-400">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{user.fullname || "Tanpa Nama"}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{user.email}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      {user.id || `USR-00${index + 1}`}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                        Bisa Login
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}