import React, { Suspense } from 'react'
import "./assets/tailwind.css"
import { Route, Routes, Navigate } from 'react-router-dom'
import Loading from './components/Loading'

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

// --- LAZY LOADING PAGES (MEMBER) ---
const MemberDashboard = React.lazy(() => import('./pages/MemberDashboard.jsx')) 

// --- LAZY LOADING PAGES (AUTH) ---
const Login = React.lazy(() => import('./pages/auth/Login.jsx'))
const Register = React.lazy(() => import('./pages/auth/Register.jsx'))
const Forgot = React.lazy(() => import('./pages/auth/Forgot.jsx'))

// 🔒 1. Protected Route Berbasis Role
function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole"); // Nilainya bisa 'admin', 'user', atau 'member'

  // Jika belum login, kembalikan ke landing page utama
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 🌟 PERBAIKAN LOGIKA: Mendukung pengecekan fleksibel untuk 'user' maupun 'member'
  const isUserMatch = allowedRole === "user" || allowedRole === "member";
  const currentUserIsUser = userRole === "user" || userRole === "member";

  if (allowedRole && userRole !== allowedRole) {
    // Jika tipe perannya sama-sama level pengguna biasa, izinkan lewat
    if (isUserMatch && currentUserIsUser) {
      return children;
    }
    
    // Alihkan paksa sesuai jalurnya masing-masing jika menyeberang hak akses
    return userRole === "admin" ? <Navigate to="/dashboard" replace /> : <Navigate to="/member" replace />;
  }

  return children;
}

// 🔓 2. Public Route (Mencegah user/admin yang sudah login masuk kembali ke halaman auth)
function PublicRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  if (isLoggedIn) {
    // Alihkan langsung ke dashboard masing-masing sesuai perannya
    return userRole === "admin" ? <Navigate to="/dashboard" replace /> : <Navigate to="/member" replace />;
  }
  
  return children;
}

function App() {
  return (
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
          <Route path="/users" element={<Users />} /> 
          <Route path="/products" element={<Courses isGuest={false} />} />
          <Route path="/products/:id" element={<ProductDetail isGuest={false} />} />
          <Route path="/craftsmen" element={<Mentor />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 🔒 PRIVATE ROUTES FOR MEMBER 
            🌟 PERBAIKAN: allowedRole diubah ke "user" atau "member" agar sinkron dengan database */}
        <Route element={<ProtectedRoute allowedRole="user"><MemberDashboard /></ProtectedRoute>}>
          <Route path="/member" element={<MemberDashboard />} />
        </Route>

        {/* 🔓 AUTH ROUTES */}
        <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
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
  )
}

export default App;