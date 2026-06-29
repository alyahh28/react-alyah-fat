import React from "react";
import { useCart } from "../context/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/member");
    } else {
      navigate("/login");
    }
  };

  return (
    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
      <DialogContent className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 border border-slate-100 shadow-2xl max-h-[90vh] flex flex-col justify-between">
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
              <span className="text-xl font-black text-slate-900">
                Rp {totalPriceSum.toLocaleString("id-ID")}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              Lanjutkan ke Pemesanan <ArrowRight size={16} />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
