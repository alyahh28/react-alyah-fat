import axios from 'axios'

// 🌟 Targetkan ke tabel 'users' di database Supabase Anda
const API_URL = "https://yaktyekwzcclxlylxkgz.supabase.co/rest/v1/users"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlha3R5ZWt3emNjbHhseWx4a2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjQ2NzksImV4cCI6MjA5NzAwMDY3OX0.8o2qKWPMCgE02sm8VAtypM9VxUXHQ-kIuYUEp-jcY0A"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation" 
}

export const authAPI = {
    // 1. Fungsi Registrasi (Insert user baru ke tabel)
    async registerUser(data) {  
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

    // 2. Fungsi Login (Cari user berdasarkan email dan password)
    async loginUser(email, password) {
        const urlWithFilter = `${API_URL}?email=eq.${encodeURIComponent(email)}&password=eq.${encodeURIComponent(password)}`
        const response = await axios.get(urlWithFilter, { headers })
        return response.data 
    },

    // 3. Fungsi Cek Email Terdaftar (Untuk validasi di halaman forgot)
    async checkEmailExists(email) {
        const urlWithFilter = `${API_URL}?email=eq.${encodeURIComponent(email)}`
        const response = await axios.get(urlWithFilter, { headers })
        return response.data
    },

    // 4. Fungsi Reset/Update Password (Update berdasarkan email)
    async resetPassword(email, newPassword) {
        const urlWithFilter = `${API_URL}?email=eq.${encodeURIComponent(email)}`
        const response = await axios.patch(urlWithFilter, { password: newPassword }, { headers })
        return response.data
    },

    // 🌟 5. BARU: Fungsi mengambil seluruh daftar users dari Supabase
    async getAllUsers() {
        const response = await axios.get(API_URL, { headers });
        return response.data;
    }
}