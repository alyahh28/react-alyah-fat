import React, { Suspense } from 'react'
import "./assets/tailwind.css"
import { Route, Routes, Navigate } from 'react-router-dom'
import Loading from './components/Loading'

// --- LAZY LOADING LAYOUTS ---
const MainLayout = React.lazy(() => import('./layouts/MainLayout.jsx'))
const AuthLayout = React.lazy(() => import('./layouts/AuthLayout.jsx'))
const GuestLayout = React.lazy(() => import('./layouts/GuestLayout.jsx'))

// --- LAZY LOADING PAGES (GUEST / PUBLIK) ---
const LandingPage = React.lazy(() => import('./pages/LandingPage.jsx')) // 👈 Halaman default
const GuestDashboard = React.lazy(() => import('./pages/GuestDashboard.jsx'))

// --- LAZY LOADING PAGES (ADMIN) ---
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'))
const Orders = React.lazy(() => import('./pages/Orders.jsx'))
const Customers = React.lazy(() => import('./pages/Customers.jsx'))
const Courses = React.lazy(() => import('./pages/Courses.jsx'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail.jsx'))
const Mentor = React.lazy(() => import('./pages/Mentor.jsx'))
const Message = React.lazy(() => import('./pages/Message.jsx'))
const Settings = React.lazy(() => import('./pages/Settings.jsx'))
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'))

// --- LAZY LOADING PAGES (AUTH) ---
const Login = React.lazy(() => import('./pages/auth/Login.jsx'))
const Register = React.lazy(() => import('./pages/auth/Register.jsx'))
const Forgot = React.lazy(() => import('./pages/auth/Forgot.jsx'))

// 🔒 Komponen Pelindung Rute (Mencegah Akses Tanpa Login)
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  // Jika belum login, arahkan ke landing page (bebas diakses)
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 🌟 PUBLIC / GUEST ROUTES */}
        <Route element={<GuestLayout />}>
          {/* Halaman default sekarang LandingPage */}
          <Route index element={<LandingPage />} />
          {/* Route opsional guest dashboard (bisa diakses via /guest) */}
          <Route path="/guest" element={<GuestDashboard />} />
          <Route path="/guest/products" element={<Courses isGuest={true} />} />
          <Route path="/guest/products/:id" element={<ProductDetail isGuest={true} />} />
        </Route>

        {/* 1. PRIVATE ROUTES (Admin/User) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Courses isGuest={false} />} />
          <Route path="/products/:id" element={<ProductDetail isGuest={false} />} />
          <Route path="/craftsmen" element={<Mentor />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 2. AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot" element={<Forgot />} />
        </Route>

        {/* 3. 404 HANDLING */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App;