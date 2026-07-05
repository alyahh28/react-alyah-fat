import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/authAPI";
import { ArrowLeft, User, Award, Clock, Star, Edit3, Settings } from "lucide-react";

export default function MemberProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pointHistory, setPointHistory] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ address: '', dob: '' });

    useEffect(() => {
        const loadData = async () => {
            const currentUser = await authAPI.getCurrentUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }
            setUser(currentUser);

            // Coba ambil dari DB dan ext storage
            const extProfile = JSON.parse(localStorage.getItem(`user_profile_ext_${currentUser.id}`) || "{}");
            setFormData({
                address: currentUser.profile?.address || extProfile.address || '',
                dob: currentUser.profile?.dob || extProfile.dob || ''
            });

            try {
                // Ambil history poin & pesanan
                const history = await authAPI.getPointHistory(currentUser.id);
                setPointHistory(history);

                const dbOrders = await authAPI.getUserOrders(currentUser.id);
                setOrders(dbOrders);
            } catch (err) {
                console.error("Gagal load history:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [navigate]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        await authAPI.completeProfile(user.id, formData);
        alert("Profil berhasil diperbarui!");
        setIsEditing(false);
        // Refresh
        window.location.reload();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    const currentPoints = user?.points || 0;
    const currentTier = user?.tier || authAPI.calculateTier(currentPoints);

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 transition">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black text-slate-900">Profil & Riwayat</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Profil Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-violet-600"></div>
                            
                            <div className="relative mt-8 text-center">
                                <div className="w-24 h-24 bg-white rounded-full p-1 mx-auto mb-4 shadow-lg">
                                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                                        <User size={40} className="text-slate-400" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{user?.fullname}</h2>
                                <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
                                
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 font-bold mb-4">
                                    <Award size={18} /> {currentTier} • {currentPoints} Pts
                                </div>
                            </div>

                            {/* Edit Form */}
                            {isEditing ? (
                                <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-left">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
                                        <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Alamat</label>
                                        <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 p-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs">Batal</button>
                                        <button type="submit" className="flex-1 p-2 bg-indigo-600 text-white font-bold rounded-lg text-xs">Simpan</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold mb-0.5">Tanggal Lahir</p>
                                        <p className="text-sm font-medium text-slate-800">{formData.dob || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold mb-0.5">Alamat Pengiriman</p>
                                        <p className="text-sm font-medium text-slate-800">{formData.address || '-'}</p>
                                    </div>
                                    <button onClick={() => setIsEditing(true)} className="w-full mt-2 py-2 flex justify-center items-center gap-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition text-sm">
                                        <Edit3 size={14} /> Edit Profil
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Tabs */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Riwayat Poin */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <Star className="text-amber-500" /> Riwayat Poin
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {pointHistory.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">Belum ada riwayat poin.</p>
                                ) : (
                                    pointHistory.map((log, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{log.reason || 'Bonus / Transaksi'}</p>
                                                <p className="text-xs text-slate-500">{new Date(log.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                                            </div>
                                            <span className={log.points_earned > 0 ? "font-black text-emerald-600" : "font-black text-rose-500"}>
                                                {log.points_earned > 0 ? '+' : ''}{log.points_earned} Pts
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Riwayat Transaksi */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <Clock className="text-indigo-500" /> Riwayat Transaksi Lengkap
                            </h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {orders.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">Belum ada pesanan.</p>
                                ) : (
                                    orders.map((ord) => (
                                        <div key={ord.id} className="border border-slate-100 rounded-2xl p-4 hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                                                <div>
                                                    <p className="text-xs text-slate-400">Order ID: <span className="font-mono text-slate-600">{ord.id?.substring(0,8)}</span></p>
                                                    <p className="text-xs text-slate-400">{new Date(ord.created_at).toLocaleDateString('id-ID')}</p>
                                                </div>
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                    {ord.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                                    <img src={ord.products?.thumbnail} className="w-full h-full object-cover" alt="Produk" onError={e=>e.target.src='https://placehold.co/100'} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800">{ord.products?.title || 'Produk'}</p>
                                                    <p className="text-xs text-slate-500">{ord.quantity}x • Rp {(ord.total_price / ord.quantity || 0).toLocaleString('id-ID')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">Total Belanja</p>
                                                    <p className="text-sm font-black text-indigo-600">Rp {(ord.total_price || 0).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
