import { ReactNode, useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Administrador',
  GERENTE_COMPRAS: 'Gerente de Compras',
  OPERARIO_BODEGA: 'Operario de Bodega',
}

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [stockOpen, setStockOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.role === 'ADMIN'
  const isAdminOrGerente = user?.role === 'ADMIN' || user?.role === 'GERENTE_COMPRAS'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStockOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const navClass = (path: string) =>
    `px-3 py-1.5 rounded text-sm font-medium transition-colors ${
      location.pathname.startsWith(path)
        ? 'bg-accent text-black'
        : 'text-white hover:bg-white/20'
    }`

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary shadow-lg sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center h-16 gap-3">
          {/* Logo */}
          <Link to="/dashboard" className="font-anton text-white text-lg tracking-wide shrink-0 mr-2">
            INVENTARIO <span className="text-accent">PyME</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-1 shrink-0">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por SKU..."
              className="px-3 py-1 text-sm rounded border-0 focus:outline-none focus:ring-2 focus:ring-accent w-44"
            />
            <button type="submit" className="bg-accent text-black text-sm px-3 py-1 rounded font-medium hover:bg-amber-400">
              Buscar
            </button>
          </form>

          {/* Nav */}
          <div className="flex items-center gap-1 flex-1 flex-wrap">
            <Link to="/dashboard" className={navClass('/dashboard')}>Dashboard</Link>
            <Link to="/products" className={navClass('/products')}>Productos</Link>
            {isAdminOrGerente && (
              <Link to="/suppliers" className={navClass('/suppliers')}>Proveedores</Link>
            )}

            {/* Stock dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setStockOpen((o) => !o)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                  location.pathname.startsWith('/stock') ? 'bg-accent text-black' : 'text-white hover:bg-white/20'
                }`}
              >
                Stock <span className="text-xs">▾</span>
              </button>
              {stockOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg min-w-36 z-50">
                  <Link to="/stock/entry" onClick={() => setStockOpen(false)} className="block px-4 py-2 text-sm hover:bg-secondary">
                    Entrada
                  </Link>
                  <Link to="/stock/exit" onClick={() => setStockOpen(false)} className="block px-4 py-2 text-sm hover:bg-secondary">
                    Salida
                  </Link>
                  {isAdminOrGerente && (
                    <Link to="/stock/adjust" onClick={() => setStockOpen(false)} className="block px-4 py-2 text-sm hover:bg-secondary">
                      Ajuste
                    </Link>
                  )}
                </div>
              )}
            </div>

            {isAdminOrGerente && (
              <Link to="/reports/valuation" className={navClass('/reports')}>Reportes</Link>
            )}
            {isAdmin && (
              <Link to="/users" className={navClass('/users')}>Usuarios</Link>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-secondary text-xs mt-0.5">{user?.role ? ROLE_LABEL[user.role] : ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-accent text-black text-sm font-medium px-3 py-1.5 rounded hover:bg-amber-400 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
