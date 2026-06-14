import React, { Suspense } from 'react'
import "./assets/tailwind.css"
import { Route, Routes, Navigate } from 'react-router-dom'
import Loading from './components/Loading'

// --- LAZY LOADING LAYOUTS ---
const MainLayout = React.lazy(() => import('./layouts/MainLayout.jsx'))
const AuthLayout = React.lazy(() => import('./layouts/AuthLayout.jsx'))

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
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        
        {/* 1. PRIVATE ROUTES (Dilindungi dengan ProtectedRoute) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Courses />} />
          <Route path="/products/:id" element={<ProductDetail />} />
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