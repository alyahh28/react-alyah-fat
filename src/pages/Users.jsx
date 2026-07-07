import { useState, useEffect } from "react";
import { MdSearch, MdSupervisorAccount, MdRefresh, MdEdit, MdBlock } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { authAPI } from "../services/authAPI";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointInput, setPointInput] = useState(0);

  // Fungsi memuat data dari Supabase via Axios Service
  const fetchUsersData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await authAPI.getAllUsers();
      // Combine with local mock status if applicable
      const bannedUsers = JSON.parse(localStorage.getItem('banned_users') || "[]");
      const mappedData = data.map(u => ({
        ...u,
        isBanned: bannedUsers.includes(u.id)
      }));
      setUsers(mappedData || []);
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

  const handleBanToggle = (userId) => {
    let bannedUsers = JSON.parse(localStorage.getItem('banned_users') || "[]");
    if (bannedUsers.includes(userId)) {
      bannedUsers = bannedUsers.filter(id => id !== userId);
    } else {
      bannedUsers.push(userId);
    }
    localStorage.setItem('banned_users', JSON.stringify(bannedUsers));
    
    // Audit log
    const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
    auditLogs.push({
        id: Date.now(),
        admin: localStorage.getItem("activeUser") || "Admin",
        role: localStorage.getItem("adminSubRole") || "super_admin",
        action: `Toggle Ban Status for User ID: ${userId}`,
        time: new Date().toLocaleString()
    });
    localStorage.setItem("audit_logs", JSON.stringify(auditLogs));

    fetchUsersData(); // Refresh UI
  };

  const handleUpdatePoints = async () => {
    if (!selectedUser) return;
    try {
      // Kita pakai authAPI.addPoints untuk menambah poin. Jika pointInput negatif, bisa dipanggil deductPoints
      if (pointInput > 0) {
        await authAPI.addPoints(selectedUser.id, Number(pointInput), "Penyesuaian Manual oleh Admin");
      } else if (pointInput < 0) {
        // Fallback untuk deduct
        await authAPI.deductPoints(selectedUser.id, Math.abs(Number(pointInput)));
      }
      
      // Audit log
      const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
      auditLogs.push({
          id: Date.now(),
          admin: localStorage.getItem("activeUser") || "Admin",
          role: localStorage.getItem("adminSubRole") || "super_admin",
          action: `Adjusted points by ${pointInput} for User ID: ${selectedUser.id}`,
          time: new Date().toLocaleString()
      });
      localStorage.setItem("audit_logs", JSON.stringify(auditLogs));

      setShowPointModal(false);
      fetchUsersData();
    } catch (err) {
      alert("Gagal memperbarui poin: " + err.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullNameLower = (user.fullname || "").toLowerCase();
    const emailLower = (user.email || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullNameLower.includes(query) || emailLower.includes(query);
  });

  return (
    <div className="p-8 w-full font-poppins bg-slate-50 min-h-screen relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <MdSupervisorAccount className="text-[#22285E]" /> Registered Users & Loyalty
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau akun pengguna, atur batas poin tiering, dan suspend akun bermasalah.
          </p>
        </div>

        <button 
          onClick={fetchUsersData}
          className="flex items-center gap-2 self-start bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition"
        >
          <MdRefresh className={`text-lg ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full max-w-md flex items-center">
          <MdSearch className="absolute left-4 text-slate-400 text-xl pointer-events-none" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#22285E]/30 focus:border-[#22285E] transition-all"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 sm:ml-auto">
          Total Terdisplay: <span className="text-[#22285E] text-sm font-bold">{filteredUsers.length}</span> Pengguna
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <ImSpinner2 className="animate-spin text-4xl text-[#22285E]" />
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
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6 text-center">Loyalty Tier</th>
                  <th className="py-4 px-6 text-center">Poin</th>
                  <th className="py-4 px-6 text-center">Status Akses</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 text-center text-slate-400">{index + 1}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{user.fullname || "Tanpa Nama"}</td>
                    <td className="py-4 px-6 text-slate-600">{user.email}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.tier === 'Platinum' ? 'bg-slate-800 text-slate-100' :
                          user.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                          user.tier === 'Silver' ? 'bg-gray-200 text-gray-700' :
                          'bg-orange-100 text-orange-700'
                      }`}>
                          {user.tier || 'Bronze'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-[#22285E]">{user.points || 0}</td>
                    <td className="py-4 px-6 text-center">
                      {user.isBanned ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">Banned</span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">Active</span>
                      )}
                    </td>
                    <td className="py-4 px-6 flex justify-center gap-2">
                        <button 
                          onClick={() => { setSelectedUser(user); setPointInput(0); setShowPointModal(true); }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition tooltip" title="Ubah Poin">
                          <MdEdit />
                        </button>
                        <button 
                          onClick={() => handleBanToggle(user.id)}
                          className={`p-2 rounded-lg transition tooltip ${user.isBanned ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`} title={user.isBanned ? "Unban User" : "Ban User"}>
                          <MdBlock />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPointModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg text-slate-800 mb-2">Kontrol Poin Manual</h3>
            <p className="text-xs text-slate-500 mb-4">Tambahkan atau kurangi poin untuk <strong>{selectedUser?.fullname}</strong>.</p>
            
            <input 
              type="number" 
              value={pointInput} 
              onChange={(e) => setPointInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-4 outline-none focus:ring-2 focus:ring-[#22285E]"
              placeholder="Contoh: 100 atau -50"
            />

            <div className="flex gap-3">
              <button onClick={() => setShowPointModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition">Batal</button>
              <button onClick={handleUpdatePoints} className="flex-1 py-3 bg-[#22285E] hover:bg-[#1a1e4a] text-white rounded-xl text-sm font-bold transition shadow-lg shadow-[#22285E]/30">Update Poin</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}