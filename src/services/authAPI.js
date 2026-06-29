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
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { fullname }
            }
        });

        if (authError) throw authError;

        if (authData?.user) {
            const { data: dbData, error: dbError } = await supabase
                .from('users')
                .upsert([{
                    id: authData.user.id,
                    fullname: fullname,
                    email: email,
                    role: role,
                    points: 0,
                    tier: 'Bronze'
                }], { onConflict: 'id' })
                .select();

            if (dbError) {
                console.error('Gagal menyimpan profil ke tabel users:', dbError);
            }
            return { authData, dbData };
        }
        return authData;
    },

    // 2. Fungsi Login
    async loginUser(email, password) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) throw authError;

        const user = authData.user;
        if (!user) throw new Error("User tidak ditemukan");

        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

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
            .eq('id', user.id)
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
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                products (title, code, thumbnail, price)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async createOrder(orderData) {
        const { data, error } = await supabase.from('orders').insert([orderData]).select();
        if (error) throw error;
        return data[0];
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
        const { data, error } = await supabase
            .from('point_history')
            .select(`
                *,
                orders (id, total_price, products(title))
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    }
};