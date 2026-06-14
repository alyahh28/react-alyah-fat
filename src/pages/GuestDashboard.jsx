// src/pages/GuestDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productsData from '../data/products.json'; 

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // --- STATE UNTUK CRM ---
  const [leadEmail, setLeadEmail] = useState('');
  const [crmMessage, setCrmMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 45, seconds: 0 });

  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
    }

    // Timer simulasi untuk Flash Sale (Fitur Urgency CRM)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- FUNGSI CRM: MENANGKAP LEAD EMAIL ---
  const handleCrmSubmit = (e) => {
    e.preventDefault();
    if (!leadEmail) return;

    // Di dunia nyata, data email ini akan dikirim ke database CRM seperti Mailchimp, HubSpot, atau Laravel CRM Backend kamu
    console.log("Lead berhasil ditangkap untuk CRM:", leadEmail);
    
    // Simpan local info untuk menyapa pelanggan nanti
    localStorage.setItem("crm_lead_email", leadEmail);
    
    setIsSubmitted(true);
    setLeadEmail('');
    setCrmMessage('🎉 Terima kasih! Kode voucher diskon 20% telah dikirim ke email Anda.');
  };

  const categories = ['Semua', ...new Set(products.map(item => item.category || 'Lainnya'))];
  const filteredProducts = selectedCategory === 'Semua' 
    ? products.slice(0, 3) 
    : products.filter(item => (item.category || 'Lainnya') === selectedCategory).slice(0, 3);

  return (
    <div className="space-y-24 py-6 text-slate-800 relative">
      
      {/* ⚡ CRM FEATURE 1: FLASH SALE & URGENCY BANNER */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="text-2xl">🔥</span>
          <div>
            <h4 className="font-bold text-amber-900 text-sm md:text-base">Penawaran Terbatas Gabung Member Akhir Pekan!</h4>
            <p className="text-amber-700 text-xs md:text-sm">Daftar akun hari ini dan dapatkan bonus saldo free-trial akses produk.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-950 text-amber-400 font-mono px-4 py-2 rounded-lg text-sm font-bold">
          <span>Sisa Waktu:</span>
          <span>{String(countdown.hours).padStart(2, '0')}</span>:
          <span>{String(countdown.minutes).padStart(2, '0')}</span>:
          <span>{String(countdown.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="space-y-6 max-w-2xl lg:text-left text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700 mx-auto lg:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Sistem Terintegrasi Layanan Pelanggan
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Ekosistem Belajar & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Produk Digital</span> Terbaik
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            Akses ribuan materi interaktif, kelola kemajuan belajarmu dengan dashboard intuitif, dan temukan produk digital berkualitas tinggi di sini.
          </p>
          <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4">
            <Link 
              to="/guest/products" 
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Jelajahi Katalog
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-md lg:max-w-xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl">
            <img 
              src="/src/assets/hero.png" 
              alt="Platform Preview" 
              className="w-full h-auto object-contain rounded-xl"
              onError={(e) => { e.target.src = "https://placehold.co/600x400/6366f1/ffffff?text=Alyah+Apps" }}
            />
          </div>
        </div>
      </section>

      {/* 2. STATISTIC / TRUST BADGE SECTION */}
      <section className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-indigo-600">10K+</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Pengguna Aktif</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-indigo-600">250+</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Produk & Kursus</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-indigo-600">4.9</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Kepuasan Pelanggan</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-indigo-600">99.9%</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Uptime Sistem CRM</div>
        </div>
      </section>

      {/* 3. INTERACTIVE CATALOG PREVIEW */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Katalog Unggulan Pilihan</h2>
            <p className="text-slate-500">Gunakan tab di bawah untuk memfilter contoh produk berdasarkan kategori.</p>
          </div>
          <Link to="/guest/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
            Lihat Semua Produk <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wider">
                      {product.category || 'Item'}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {product.price ? `Rp ${product.price.toLocaleString()}` : 'Gratis'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-xs text-slate-400">Hubungan Pelanggan Terjamin</span>
                  <Link 
                    to={`/guest/products/${product.id}`} 
                    className="text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-all duration-150"
                  >
                    Detail Rinci
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400">
            Tidak ada produk saat ini.
          </div>
        )}
      </section>

      {/* 📥 CRM FEATURE 2: LEAD CAPTURE NEWSLETTER SECTION */}
      <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl text-center lg:text-left">
          <h3 className="text-2xl font-bold text-slate-900">Dapatkan Kupon Diskon Pertama Anda!</h3>
          <p className="text-slate-600 text-sm md:text-base">
            Berlangganan buletin informasi produk kami. Kami akan mengirimkan tips eksklusif mingguan serta kupon potongan harga khusus pelanggan baru.
          </p>
        </div>
        
        <div className="w-full max-w-md">
          {!isSubmitted ? (
            <form onSubmit={handleCrmSubmit} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Masukkan alamat email aktif Anda" 
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              />
              <button 
                type="submit" 
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition duration-150"
              >
                Klaim Kupon
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold text-center animate-fadeIn">
              {crmMessage}
            </div>
          )}
        </div>
      </section>

      {/* 4. CALL TO ACTION (CTA) BANNER */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-950 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Siap Untuk Memulai Pengalaman Penuh?</h2>
          <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
            Daftarkan diri Anda sekarang juga secara gratis untuk membuka seluruh akses manajemen fitur, melihat statistik penjualan, dan berinteraksi langsung dengan mentor.
          </p>
          <div className="pt-4">
            <Link 
              to="/register" 
              className="inline-block px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-0.5 duration-150"
            >
              Buat Akun Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* 💬 CRM FEATURE 3: FLOATING LIVE CHAT / WHATSAPP CRM WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 group flex flex-col items-end">
        {/* Balon chat melayang (Tooltip petunjuk) */}
        <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Ada pertanyaan? Chat admin Kami! 😊
        </div>
        
        {/* Tombol Aksi Buka WhatsApp Link */}
        <a 
          href="https://wa.me/6281234567890?text=Halo%20Admin%20Alyah%20Apps,%20saya%20tertarik%20tanya%20seputar%20produk" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 hover:rotate-12 transition-all duration-200"
        >
          {/* SVG Icon WhatsApp Sederhana */}
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.4.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.736.001-2.599-1.013-5.045-2.853-6.887C16.641 2.138 14.197 1.11 11.602 1.11 6.162 1.11 1.74 5.48 1.737 10.846c-.001 1.693.447 3.35 1.295 4.811L1.98 20.34l4.667-1.186z"/>
          </svg>
        </a>
      </div>

    </div>
  );
};

export default GuestDashboard;