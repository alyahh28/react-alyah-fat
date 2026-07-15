import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, PackageX, MapPin, CreditCard, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/authAPI";

export default function CartPopup() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPriceSum,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [userTier, setUserTier] = useState("Bronze");
  const [userPoints, setUserPoints] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Checkout Form State
  const [address, setAddress] = useState("");
  const [courier, setCourier] = useState("JNE");
  const [payment, setPayment] = useState("Bank Transfer");
  const [usePoints, setUsePoints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isCartOpen) {
      setStep(1);
      setSuccessMsg("");
      authAPI.getCurrentUser().then(user => {
        if (user) {
          setCurrentUser(user);
          setUserTier(user.tier || "Bronze");
          setUserPoints(user.points || 0);
          
          // Pre-fill address
          if (user.profile?.address) {
            setAddress(user.profile.address);
          } else {
            const extProfile = JSON.parse(localStorage.getItem(`user_profile_ext_${user.id}`) || "{}");
            if (extProfile.address) setAddress(extProfile.address);
          }
        }
      }).catch(err => console.error("Error fetching cart tier:", err));
    }
  }, [isCartOpen]);

  const appliedPromo = parseInt(localStorage.getItem("appliedPromo") || "0");
  const discountRate = authAPI.getTierDiscountRate(userTier) + (appliedPromo / 100);
  const discountedTotalPrice = Math.round(totalPriceSum * (1 - discountRate));

  // Kalkulasi penggunaan poin (100 poin = Rp 10.000)
  const maxPointsCanUse = Math.floor(discountedTotalPrice / 100); // 1 point = Rp 100
  const pointsToUse = Math.min(userPoints, maxPointsCanUse);
  const pointDiscountAmt = usePoints ? (pointsToUse * 100) : 0;
  
  const finalPrice = Math.max(0, discountedTotalPrice - pointDiscountAmt);

  const handleNextStep = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      setIsCartOpen(false);
      navigate("/login");
      return;
    }
    setStep(2);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      alert("Alamat harus diisi");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create orders for each cart item
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const itemDiscPrice = Math.round(item.price * (1 - discountRate));
        
        const orderPayload = {
          user_id: currentUser.profile?.id || currentUser.id,
          product_id: item.id,
          quantity: item.quantity,
          total_price: itemDiscPrice * item.quantity,
          status: "pending",
          shipping_address: address,
          // Only deduct points on the first order payload to avoid multiple deductions
          points_used: (i === 0 && usePoints) ? pointsToUse : 0 
        };
        
        await authAPI.createOrder(orderPayload);
      }
      
      setSuccessMsg("Pesanan berhasil dibuat! Poin akan bertambah setelah pesanan dikonfirmasi oleh Admin.");
      clearCart();
      setTimeout(() => {
        setIsCartOpen(false);
        navigate("/member");
      }, 3000);
      
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
      <DialogContent className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 border border-slate-100 shadow-2xl max-h-[90vh] flex flex-col justify-between">
        
        {successMsg ? (
           <div className="py-16 flex flex-col items-center justify-center text-center">
             <CheckCircle2 size={64} className="text-emerald-500 mb-4" />
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Checkout Berhasil!</h3>
             <p className="text-slate-500 text-sm">{successMsg}</p>
           </div>
        ) : step === 1 ? (
          /* STEP 1: CART LIST */
          <>
            <div>
              <DialogHeader className="border-b border-slate-100 pb-4">
                <DialogTitle className="text-xl font-bold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="text-indigo-600" size={24} /> Keranjang Belanja
                  </span>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition"
                    >
                      Kosongkan
                    </button>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="overflow-y-auto max-h-[50vh] my-4 pr-1 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                    <PackageX size={48} className="text-slate-300 mb-2 stroke-1" />
                    <p className="font-semibold text-slate-600 text-sm">Keranjang Anda Masih Kosong</p>
                    <p className="text-xs text-slate-400 mt-1">Jelajahi katalog furnitur impian Anda dan tambahkan ke keranjang.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 transition hover:bg-slate-50"
                    >
                      <img
                        src={item.thumbnail || "https://placehold.co/100x100?text=Produk"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{item.title}</h4>
                        <p className="text-xs font-extrabold text-indigo-600 mt-0.5">
                          Rp {(item.price || 0).toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-slate-500 hover:bg-slate-100 transition"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-slate-500 hover:bg-slate-100 transition"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0"
                        title="Hapus item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-slate-500 font-medium">Total Perkiraan:</span>
                  <div className="text-right">
                    {discountRate > 0 && (
                      <span className="text-xs text-slate-400 line-through mr-2">
                        Rp {totalPriceSum.toLocaleString("id-ID")}
                      </span>
                    )}
                    <span className="text-xl font-black text-slate-900">
                      Rp {discountedTotalPrice.toLocaleString("id-ID")}
                    </span>
                    {discountRate > 0 && (
                      <div className="text-[10px] text-amber-600 font-bold mt-0.5">
                        (Termasuk Diskon {discountRate * 100}%)
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Lanjutkan ke Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* STEP 2: CHECKOUT FORM */
          <>
            <DialogHeader className="border-b border-slate-100 pb-3">
                <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <button onClick={() => setStep(1)} className="p-1 text-slate-400 hover:text-slate-700 transition">
                      <ArrowLeft size={20} />
                  </button>
                  Formulir Checkout
                </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCheckoutSubmit} className="overflow-y-auto max-h-[60vh] my-4 pr-1 space-y-5">
                
                {/* ALAMAT */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1"><MapPin size={14}/> Alamat Pengiriman</label>
                    <textarea 
                        required 
                        rows="2" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        placeholder="Masukkan alamat lengkap pengiriman..."
                    />
                </div>

                {/* KURIR & PEMBAYARAN */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Pilih Kurir</label>
                        <select 
                            value={courier} 
                            onChange={(e) => setCourier(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white"
                        >
                            <option value="JNE">JNE Express</option>
                            <option value="J&T">J&T Regular</option>
                            <option value="Sicepat">SiCepat HALU</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1"><CreditCard size={14}/> Metode Pembayaran</label>
                        <select 
                            value={payment} 
                            onChange={(e) => setPayment(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white"
                        >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Credit Card">Kartu Kredit</option>
                            <option value="E-Wallet">E-Wallet (OVO/Dana)</option>
                        </select>
                    </div>
                </div>

                {/* REDEEM POINTS */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-amber-900">Tukar Poin Member</span>
                        <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">{userPoints} Pts Tersedia</span>
                    </div>
                    <p className="text-[10px] text-amber-700 mb-3">Tukarkan 1 Poin = Rp 100. Maksimal penukaran disesuaikan dengan total belanja.</p>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={usePoints} onChange={() => setUsePoints(!usePoints)} disabled={pointsToUse === 0} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${usePoints ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${usePoints ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <span className={`text-xs font-bold ${pointsToUse > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
                            {pointsToUse > 0 
                                ? `Gunakan ${pointsToUse} Pts (-Rp ${pointDiscountAmt.toLocaleString('id-ID')})` 
                                : 'Poin tidak cukup / Total terlalu kecil'}
                        </span>
                    </label>
                </div>

                {/* SUMMARY */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-500">
                        <span>Total Harga (Diskon Tier {discountRate * 100}%)</span>
                        <span className="font-semibold">Rp {discountedTotalPrice.toLocaleString("id-ID")}</span>
                    </div>
                    {usePoints && (
                        <div className="flex justify-between text-amber-600 font-semibold">
                            <span>Potongan Poin</span>
                            <span>- Rp {pointDiscountAmt.toLocaleString("id-ID")}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-slate-900 font-black text-lg pt-2 border-t border-slate-100">
                        <span>Total Bayar</span>
                        <span>Rp {finalPrice.toLocaleString("id-ID")}</span>
                    </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3.5 bg-emerald-600 text-white rounded-full font-bold text-sm hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Memproses Pesanan..." : "Bayar Sekarang"}
                </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
