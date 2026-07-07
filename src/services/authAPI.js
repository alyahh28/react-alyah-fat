import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yaktyekwzcclxlylxkgz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlha3R5ZWt3emNjbHhseWx4a2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjQ2NzksImV4cCI6MjA5NzAwMDY3OX0.8o2qKWPMCgE02sm8VAtypM9VxUXHQ-kIuYUEp-jcY0A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const authAPI = {
    // 🌟 HELPER TIERING & DISKON LOYALTY (PRD 3)
    calculateTier(points = 0) {
        if (points >= 7000) return 'Platinum';
        if (points >= 3000) return 'Gold';
        if (points >= 1000) return 'Silver';
        return 'Bronze';
    },

    getTierDiscountRate(tier = 'Bronze') {
        const t = (tier || 'Bronze').toLowerCase();
        if (t === 'platinum') return 0.20; // 20%
        if (t === 'gold') return 0.15;     // 15%
        if (t === 'silver') return 0.10;   // 10%
        return 0.05;                        // 5% (Bronze)
    },

    // 1. Fungsi Registrasi (Supabase Auth + insert profile ke tabel users)
    async registerUser({ fullname, email, password, role = 'member' }) {
        // Translate common Supabase errors to Indonesian
        const translateError = (msg = '') => {
            if (msg.includes('already registered') || msg.includes('User already registered'))
                return 'Email ini sudah terdaftar. Silakan gunakan email lain atau langsung login.';
            if (msg.includes('invalid email')) return 'Format email tidak valid.';
            if (msg.includes('Password should be')) return 'Password minimal 6 karakter.';
            if (msg.includes('weak_password')) return 'Password terlalu lemah. Gunakan minimal 6 karakter dengan kombinasi huruf dan angka.';
            return msg || 'Pendaftaran gagal. Coba lagi.';
        };

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { fullname }
            }
        });

        if (authError) {
            const err = new Error(translateError(authError.message));
            err.originalError = authError;
            throw err;
        }

        // Check if email confirmation is required
        // authData.user will exist but session will be null if confirmation needed
        const needsConfirmation = authData?.user && !authData?.session;

        if (authData?.user) {
            // Cek dulu apakah email sudah ada di tabel users
            const { data: existingProfile } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (existingProfile) {
                // Email sudah ada di tabel users, skip insert
                console.log('Profil sudah ada, skip insert.');
            } else {
                // Insert profil baru
                const { data: insertedData, error: dbError } = await supabase
                    .from('users')
                    .insert([{
                        fullname: fullname,
                        email: email,
                        password: password,
                        role: role,
                        points: 0,
                        tier: 'Bronze'
                    }])
                    .select();

                if (dbError) {
                    console.error('❌ Gagal simpan profil ke tabel users:', dbError);
                    // Lempar error agar terlihat di UI
                    throw new Error(`Akun dibuat di Auth, tapi gagal simpan profil: ${dbError.message}`);
                }
                console.log('✅ Profil berhasil disimpan:', insertedData);
            }
        }

        return { authData, needsConfirmation };
    },

    // 2. Fungsi Login
    async loginUser(email, password) {
        const translateError = (msg = '') => {
            if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials'))
                return 'Email atau password salah. Pastikan data yang kamu masukkan benar.';
            if (msg.includes('Email not confirmed'))
                return 'Email belum dikonfirmasi. Silakan cek inbox email kamu dan klik link verifikasi.';
            if (msg.includes('Too many requests'))
                return 'Terlalu banyak percobaan login. Tunggu beberapa menit lalu coba lagi.';
            if (msg.includes('User not found')) return 'Akun dengan email ini tidak ditemukan.';
            return msg || 'Login gagal. Coba lagi.';
        };

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            const err = new Error(translateError(authError.message));
            err.originalError = authError;
            throw err;
        }

        const user = authData.user;
        if (!user) throw new Error('User tidak ditemukan.');

        let profile = null;
        try {
            const { data: profileData } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .maybeSingle();
            profile = profileData;
        } catch (profileErr) {
            console.warn('Gagal ambil profil, lanjutkan dengan data Auth:', profileErr);
        }

        // Jika profil belum ada, buat otomatis
        if (!profile) {
            const fullnameFallback = user.user_metadata?.fullname || email.split('@')[0];
            try {
                const { data: newProfile } = await supabase.from('users').insert([{
                    fullname: fullnameFallback,
                    email: email,
                    password: password,
                    role: 'member',
                    points: 0,
                    tier: 'Bronze'
                }]).select().single();
                profile = newProfile || { fullname: fullnameFallback, role: 'member', points: 0, tier: 'Bronze' };
            } catch (createErr) {
                console.warn('Gagal buat profil otomatis:', createErr);
                profile = { fullname: fullnameFallback, role: 'member', points: 0, tier: 'Bronze' };
            }
        }

        const role = (profile?.role || user.user_metadata?.role || 'member').toLowerCase();
        const fullname = profile?.fullname || user.user_metadata?.fullname || email.split('@')[0];
        const points = profile?.points || 0;
        const tier = profile?.tier || this.calculateTier(points);

        return {
            ...user,
            fullname,
            role,
            points,
            tier,
            profile
        };
    },

    // 3. Fungsi Reset Password
    async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`
        });
        if (error) throw error;
        return data;
    },

    // 4. Fungsi Logout
    async logoutUser() {
        const { error } = await supabase.auth.signOut();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("activeUser");
        localStorage.removeItem("userRole");
        localStorage.removeItem("adminSubRole");
        if (error) console.error("SignOut error:", error);
    },

    // 5. Fungsi Mengambil Sesi Pengguna Saat Ini
    async getCurrentUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const user = session.user;
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();

        const role = (profile?.role || user.user_metadata?.role || 'member').toLowerCase();
        const fullname = profile?.fullname || user.user_metadata?.fullname || user.email?.split('@')[0] || 'User';
        const points = profile?.points || 0;
        const tier = profile?.tier || this.calculateTier(points);

        return {
            ...user,
            fullname,
            role,
            points,
            tier,
            profile
        };
    },

    async getAllUsers() {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        return data;
    },

    async updateUserRole(email, newRole) {
        const { data, error } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('email', email)
            .select();
        if (error) throw error;
        return data;
    },

    // ================= PROMO CODES (PRD 3) =================
    async generatePromoCode(email) {
        const code = `PROMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const { data, error } = await supabase
            .from('promo_codes')
            .insert([{
                code: code,
                email: email,
                discount_percent: 10,
                used: false
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async validatePromoCode(code) {
        // Query untuk mencari promo code berdasarkan kode saja
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code)
            .eq('used', false)
            .maybeSingle();

        if (error) throw error;
        
        if (data) {
            // Tandai sudah digunakan
            const { error: updateError } = await supabase
                .from('promo_codes')
                .update({ used: true })
                .eq('code', code);
                
            if (updateError) throw updateError;
            return data.discount_percent;
        }
        
        return null;
    },



    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('users')
            .select('id, fullname, email, points, tier')
            .eq('id', userId)
            .maybeSingle();
            
        if (error) throw error;
        return data;
    },

    // ================= CRUD PRODUCTS =================
    async getAllProducts() {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getProductById(id) {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async addProduct(productData) {
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (error) throw error;
        return data[0];
    },

    async updateProduct(id, productData) {
        const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async deleteProduct(id) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    async seedProducts(productsList) {
        const cleanProducts = productsList.map(p => ({
            title: p.title,
            code: p.code || `LW-${Math.floor(100 + Math.random() * 900)}`,
            category: p.category || 'General',
            brand: p.brand || 'LuxWood',
            price: p.price || 0,
            stock: p.stock || 10,
            thumbnail: p.thumbnail || '',
            description: p.description || ''
        }));
        const { data, error } = await supabase.from('products').insert(cleanProducts).select();
        if (error) throw error;
        return data;
    },

    // ================= CRUD CUSTOMERS =================
    async getAllCustomers() {
        const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async addCustomer(customerData) {
        const { data, error } = await supabase.from('customers').insert([customerData]).select();
        if (error) throw error;
        return data[0];
    },

    async updateCustomer(id, customerData) {
        const { data, error } = await supabase.from('customers').update(customerData).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async deleteCustomer(id) {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    // ================= CRUD ORDERS & LOYALTY (PRD 3) =================
    async getAllOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                products (title, code, thumbnail, price),
                users (fullname, email)
            `)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getUserOrders(userId) {
        // Ambil order lokal terlebih dahulu sebagai fallback
        const localOrders = JSON.parse(localStorage.getItem(`local_orders_${userId}`) || '[]');
        
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    products (title, code, thumbnail, price)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            
            // Gabungkan order dari DB dengan order lokal (hindari duplikat)
            const dbOrderIds = new Set((data || []).map(o => o.id));
            const uniqueLocal = localOrders.filter(o => !dbOrderIds.has(o.id));
            return [...(data || []), ...uniqueLocal];
        } catch (err) {
            console.warn("getUserOrders DB gagal, menggunakan data lokal:", err.message);
            return localOrders;
        }
    },

    async createOrder(orderData) {
        let finalOrderData = { ...orderData };
        const pointsUsed = finalOrderData.points_used || 0;
        // keep points_used for local storage, remove for Supabase insert
        
        // ---- Coba simpan ke Supabase terlebih dahulu ----
        try {
            const supabasePayload = { ...finalOrderData };
            delete supabasePayload.points_used; // Supabase mungkin belum punya kolom ini
            
            const { data, error } = await supabase.from('orders').insert([supabasePayload]).select();
            if (error) throw error;
            
            // Kurangi poin jika digunakan
            if (pointsUsed > 0 && finalOrderData.user_id) {
                await this.deductPoints(finalOrderData.user_id, pointsUsed);
            }
            return data[0];
        } catch (dbError) {
            // ---- FALLBACK: Simpan ke localStorage jika Supabase gagal ----
            console.warn("Supabase createOrder gagal, fallback ke localStorage:", dbError.message);
            
            const localOrder = {
                ...finalOrderData,
                id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                created_at: new Date().toISOString(),
                status: finalOrderData.status || 'pending',
                points_used: pointsUsed
            };
            
            const userId = finalOrderData.user_id || 'unknown';
            const existingOrders = JSON.parse(localStorage.getItem(`local_orders_${userId}`) || '[]');
            existingOrders.unshift(localOrder);
            localStorage.setItem(`local_orders_${userId}`, JSON.stringify(existingOrders));
            
            // Kurangi poin lokal jika digunakan
            if (pointsUsed > 0 && userId) {
                await this.deductPoints(userId, pointsUsed);
            }
            
            return localOrder;
        }
    },

    async updateOrderStatus(orderId, newStatus) {
        // 1. Update status pesanan di tabel orders
        const { data, error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId).select();
        if (error) throw error;

        const updatedOrder = data[0];

        // 2. Jika status berubah menjadi 'completed', proses akumulasi poin & tiering
        if (updatedOrder && newStatus === 'completed' && updatedOrder.user_id) {
            try {
                const pointsEarned = Math.floor((updatedOrder.total_price || 0) / 1000);

                if (pointsEarned > 0) {
                    // Cek apakah poin order ini sudah dicatat di point_history
                    const { data: existingHist } = await supabase
                        .from('point_history')
                        .select('id')
                        .eq('order_id', orderId);

                    if (!existingHist || existingHist.length === 0) {
                        // Ambil user terkini
                        const { data: userProfile } = await supabase
                            .from('users')
                            .select('points')
                            .eq('id', updatedOrder.user_id)
                            .single();

                        const currentPts = userProfile?.points || 0;
                        const newPts = currentPts + pointsEarned;
                        const newTier = this.calculateTier(newPts);

                        // Update tabel users
                        await supabase
                            .from('users')
                            .update({ points: newPts, tier: newTier })
                            .eq('id', updatedOrder.user_id);

                        // Simpan log di point_history
                        await supabase
                            .from('point_history')
                            .insert([{
                                user_id: updatedOrder.user_id,
                                order_id: orderId,
                                points_earned: pointsEarned
                            }]);
                    }
                }
            } catch (err) {
                console.error("Client fallback point accumulation error (mungkin sudah ditangani trigger DB):", err);
            }
        }

        return updatedOrder;
    },

    // ================= POINT HISTORY (PRD 3) =================
    async getPointHistory(userId) {
        let dbHistory = [];
        try {
            const { data, error } = await supabase
                .from('point_history')
                .select(`
                    *,
                    orders (id, total_price, products(title))
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (!error) dbHistory = data || [];
        } catch (e) {
            console.warn("DB point history missing:", e);
        }

        // Ambil juga dari localStorage (untuk poin non-transaksi jika DB menolak foreign key null)
        const localHistory = JSON.parse(localStorage.getItem(`point_history_${userId}`) || "[]");
        
        // Gabungkan dan urutkan
        const combined = [...dbHistory, ...localHistory].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return combined;
    },

    // ================= NEW LOYALTY FEATURES (FASE 1-4) =================
    
    // Helper untuk menambah poin (fallback lokal jika DB strict)
    async addPoints(userId, points, reason, orderId = null) {
        try {
            // Ambil user terkini
            const { data: userProfile, error: getErr } = await supabase
                .from('users')
                .select('points')
                .eq('id', userId)
                .single();

            if (getErr) throw getErr;

            const currentPts = userProfile?.points || 0;
            const newPts = currentPts + points;
            const newTier = this.calculateTier(newPts);

            // Update tabel users
            await supabase
                .from('users')
                .update({ points: newPts, tier: newTier })
                .eq('id', userId);

            const logEntry = {
                id: `loc_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
                user_id: userId,
                order_id: orderId,
                points_earned: points,
                created_at: new Date().toISOString(),
                reason: reason // custom field untuk UI
            };

            // Simpan log di point_history, kalau gagal masukin ke localstorage
            const { error: insertErr } = await supabase
                .from('point_history')
                .insert([{
                    user_id: userId,
                    order_id: orderId,
                    points_earned: points
                }]);
                
            if (insertErr) throw insertErr;
        } catch (err) {
            console.warn("Menggunakan LocalStorage untuk log poin karena error DB:", err.message);
            const localKey = `point_history_${userId}`;
            const history = JSON.parse(localStorage.getItem(localKey) || "[]");
            history.push({
                id: `loc_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
                user_id: userId,
                order_id: orderId,
                points_earned: points,
                created_at: new Date().toISOString(),
                reason: reason
            });
            localStorage.setItem(localKey, JSON.stringify(history));
        }
    },

    // Mengurangi poin
    async deductPoints(userId, points) {
        const { data: userProfile } = await supabase
            .from('users')
            .select('points')
            .eq('id', userId)
            .single();

        const currentPts = userProfile?.points || 0;
        if (currentPts < points) throw new Error("Poin tidak cukup.");
        
        const newPts = currentPts - points;
        const newTier = this.calculateTier(newPts);

        await supabase
            .from('users')
            .update({ points: newPts, tier: newTier })
            .eq('id', userId);
            
        // Catat deduction di localStorage agar terlihat di riwayat
        const localKey = `point_history_${userId}`;
        const history = JSON.parse(localStorage.getItem(localKey) || "[]");
        history.push({
            id: `deduct_${Date.now()}`,
            user_id: userId,
            points_earned: -points, // negatif
            created_at: new Date().toISOString(),
            reason: "Penukaran Poin untuk Potongan Harga"
        });
        localStorage.setItem(localKey, JSON.stringify(history));
    },

    async claimWelcomeBonus(userId) {
        const claimed = localStorage.getItem(`welcome_claimed_${userId}`);
        if (!claimed) {
            await this.addPoints(userId, 10, "Bonus Pendaftaran");
            localStorage.setItem(`welcome_claimed_${userId}`, "true");
            return true;
        }
        return false;
    },

    async completeProfile(userId, profileData) {
        // Update user data (address, dob)
        // Karena kolom ini mungkin belum ada di DB Supabase, kita gabungkan ke localStorage juga
        const localProfileKey = `user_profile_ext_${userId}`;
        localStorage.setItem(localProfileKey, JSON.stringify(profileData));
        
        try {
            await supabase.from('users').update({ 
                address: profileData.address,
                dob: profileData.dob
            }).eq('id', userId);
        } catch (e) {
            console.warn("DB tidak punya kolom address/dob, abaikan error", e);
        }

        const claimed = localStorage.getItem(`profile_bonus_claimed_${userId}`);
        if (!claimed) {
            await this.addPoints(userId, 20, "Melengkapi Profil");
            localStorage.setItem(`profile_bonus_claimed_${userId}`, "true");
            return true;
        }
        return false;
    },

    async dailyCheckIn(userId) {
        const date = new Date().toISOString().split('T')[0];
        const key = `daily_checkin_${userId}_${date}`;
        if (!localStorage.getItem(key)) {
            await this.addPoints(userId, 2, "Daily Check-in");
            localStorage.setItem(key, "true");
            return true;
        }
        return false;
    },

    async shareProduct(userId) {
        const date = new Date().toISOString().split('T')[0];
        const key = `share_product_${userId}_${date}`;
        if (!localStorage.getItem(key)) {
            await this.addPoints(userId, 5, "Share Produk ke Sosial Media");
            localStorage.setItem(key, "true");
            return true;
        }
        return false;
    },

    async submitReview(userId, orderId, rating, reviewText) {
        const key = `review_claimed_${orderId}`;
        if (!localStorage.getItem(key)) {
            // Catat review ke localstorage (mock db)
            const reviews = JSON.parse(localStorage.getItem('product_reviews') || "[]");
            reviews.push({ orderId, userId, rating, reviewText, created_at: new Date().toISOString() });
            localStorage.setItem('product_reviews', JSON.stringify(reviews));

            await this.addPoints(userId, 15, "Ulasan Produk", orderId);
            localStorage.setItem(key, "true");
            return true;
        }
        return false;
    }
};