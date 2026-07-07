import React, { Suspense, useEffect, useState } from 'react'
import "./assets/tailwind.css"
import { Route, Routes, Navigate } from 'react-router-dom'
import Loading from './components/Loading'
import { supabase } from './services/authAPI'
import { CartProvider } from './context/CartContext'
import CartPopup from './components/CartPopup'

// --- LAZY LOADING LAYOUTS ---
const MainLayout = React.lazy(() => import('./layouts/MainLayout.jsx'))
const AuthLayout = React.lazy(() => import('./layouts/AuthLayout.jsx'))
const GuestLayout = React.lazy(() => import('./layouts/GuestLayout.jsx'))

// --- LAZY LOADING PAGES (GUEST / PUBLIK) ---
const LandingPage = React.lazy(() => import('./pages/LandingPage.jsx')) 

// --- LAZY LOADING PAGES (ADMIN) ---
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'))
const Orders = React.lazy(() => import('./pages/Orders.jsx'))
const Customers = React.lazy(() => import('./pages/Customers.jsx'))
const Users = React.lazy(() => import('./pages/Users.jsx')) 
const Courses = React.lazy(() => import('./pages/Courses.jsx'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail.jsx'))
const Mentor = React.lazy(() => import('./pages/Mentor.jsx'))
const Message = React.lazy(() => import('./pages/Message.jsx'))
const Settings = React.lazy(() => import('./pages/Settings.jsx'))
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'))
const Promotions = React.lazy(() => import('./pages/Promotions.jsx'))
const Finance = React.lazy(() => import('./pages/Finance.jsx'))
const Complaints = React.lazy(() => import('./pages/Complaints.jsx'))
const AuditLog = React.lazy(() => import('./pages/AuditLog.jsx'))

// --- LAZY LOADING PAGES (MEMBER) ---
const MemberDashboard = React.lazy(() => import('./pages/MemberDashboard.jsx')) 
const MemberProfile = React.lazy(() => import('./pages/MemberProfile.jsx'))

// --- LAZY LOADING PAGES (AUTH) ---
const Login = React.lazy(() => import('./pages/auth/Login.jsx'))
const Register = React.lazy(() => import('./pages/auth/Register.jsx'))
const Forgot = React.lazy(() => import('./pages/auth/Forgot.jsx'))
const AdminLogin = React.lazy(() => import('./pages/auth/AdminLogin.jsx'))

// 🔒 1. Protected Route Berbasis Role
function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = (localStorage.getItem("userRole") || "").toLowerCase();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const isUserMatch = allowedRole === "user" || allowedRole === "member";
  const currentUserIsUser = userRole === "user" || userRole === "member";

  if (allowedRole && userRole !== allowedRole.toLowerCase()) {
    if (isUserMatch && currentUserIsUser) {
      return children;
    }
    return userRole === "admin" ? <Navigate to="/dashboard" replace /> : <Navigate to="/member" replace />;
  }

  return children;
}

// 🔓 2. Public Route (Mencegah user/admin yang sudah login masuk kembali ke halaman auth)
function PublicRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = (localStorage.getItem("userRole") || "").toLowerCase();

  if (isLoggedIn) {
    return userRole === "admin" ? <Navigate to="/dashboard" replace /> : <Navigate to="/member" replace />;
  }
  
  return children;
}

function App() {
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('role, fullname')
            .eq('email', session.user.email)
            .maybeSingle();

          if (profileError || !profile) {
            // Profil tidak ditemukan atau query gagal — jangan anggap login
            console.warn('Session ada tapi profil tidak valid, sign out...');
            await supabase.auth.signOut();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
            localStorage.removeItem("activeUser");
          } else {
            // Profil valid — set sebagai logged in
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", (profile.role || "member").toLowerCase());
            localStorage.setItem("activeUser", profile.fullname || session.user.email);
          }
        } else {
          // Tidak ada session — pastikan localStorage bersih
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userRole");
          localStorage.removeItem("activeUser");
        }
      } catch (err) {
        console.error("Gagal memeriksa sesi Supabase:", err);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        localStorage.removeItem("activeUser");
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        localStorage.removeItem("activeUser");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (checkingSession) {
    return <Loading />;
  }

  return (
    <CartProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 🌟 PUBLIC / GUEST ROUTES */}
          <Route element={<GuestLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/guest" element={<LandingPage />} />
            <Route path="/guest/products" element={<Courses isGuest={true} />} />
            <Route path="/guest/products/:id" element={<ProductDetail isGuest={true} />} />
          </Route>

          {/* 🔒 PRIVATE ROUTES FOR ADMIN */}
          <Route element={<ProtectedRoute allowedRole="admin"><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route text-path="/users" path="/users" element={<Users />} /> 
            <Route path="/products" element={<Courses isGuest={false} />} />
            <Route path="/products/:id" element={<ProductDetail isGuest={false} />} />
            <Route path="/craftsmen" element={<Mentor />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 🔒 PRIVATE ROUTES FOR MEMBER */}
          <Route path="/member" element={<ProtectedRoute allowedRole="member"><MemberDashboard /></ProtectedRoute>} />
          <Route path="/member/profile" element={<ProtectedRoute allowedRole="member"><MemberProfile /></ProtectedRoute>} />

          {/* 🔓 AUTH ROUTES */}
          <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
            <Route path="/admin/control-panel" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot" element={<Forgot />} />
          </Route>

          {/* ❌ 3. 404 HANDLING */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <CartPopup />
    </CartProvider>
  )
}

export default App;