import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductKardex from './pages/ProductKardex'
import Suppliers from './pages/Suppliers'
import StockEntry from './pages/StockEntry'
import StockExit from './pages/StockExit'
import StockAdjust from './pages/StockAdjust'
import ReportsValuation from './pages/ReportsValuation'
import Users from './pages/Users'

function LayoutRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Parameters<typeof ProtectedRoute>[0]['allowedRoles'] }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
          <Route path="/products" element={<LayoutRoute><Products /></LayoutRoute>} />
          <Route path="/products/:id/kardex" element={<LayoutRoute><ProductKardex /></LayoutRoute>} />
          <Route path="/suppliers" element={<LayoutRoute allowedRoles={['ADMIN', 'GERENTE_COMPRAS']}><Suppliers /></LayoutRoute>} />
          <Route path="/stock/entry" element={<LayoutRoute><StockEntry /></LayoutRoute>} />
          <Route path="/stock/exit" element={<LayoutRoute><StockExit /></LayoutRoute>} />
          <Route path="/stock/adjust" element={<LayoutRoute allowedRoles={['ADMIN', 'GERENTE_COMPRAS']}><StockAdjust /></LayoutRoute>} />
          <Route path="/reports/valuation" element={<LayoutRoute allowedRoles={['ADMIN', 'GERENTE_COMPRAS']}><ReportsValuation /></LayoutRoute>} />
          <Route path="/users" element={<LayoutRoute allowedRoles={['ADMIN']}><Users /></LayoutRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
