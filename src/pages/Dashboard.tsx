import { useEffect, useState } from 'react'
import api from '../api/axios'
import { DashboardData, Product } from '../types'

const TYPE_LABEL: Record<string, string> = {
  ENTRY: 'ENTRADA',
  EXIT: 'SALIDA',
  ADJUSTMENT: 'AJUSTE',
}

const TYPE_COLOR: Record<string, string> = {
  ENTRY: 'bg-green-100 text-green-800',
  EXIT: 'bg-red-100 text-red-800',
  ADJUSTMENT: 'bg-blue-100 text-blue-800',
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, prodRes] = await Promise.all([
          api.get<DashboardData>('/api/v1/dashboard'),
          api.get<Product[]>('/api/v1/products'),
        ])
        setData(dashRes.data)
        setProducts(prodRes.data)
      } catch {
        setError('Error al cargar el dashboard')
      } finally {
        setLoading(false)
      }
    }
    void fetchAll()
  }, [])

  const skuByProductId = Object.fromEntries(products.map((p) => [p.id, p.sku]))

  if (loading) return <div className="flex justify-center py-20 text-primary font-medium">Cargando...</div>
  if (error) return <div className="text-red-600 text-center py-20">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="font-anton text-3xl text-primary tracking-wide">DASHBOARD</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-primary">
          <p className="text-sm text-gray-500 font-medium">Valor Total del Inventario</p>
          <p className="font-anton text-3xl text-primary mt-1">
            ${data.totalInventoryValue.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-accent">
          <p className="text-sm text-gray-500 font-medium">Productos Únicos</p>
          <p className="font-anton text-3xl text-primary mt-1">{data.totalProducts}</p>
        </div>
      </div>

      {/* Low stock alerts */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg text-primary mb-4 flex items-center gap-2">
          <span className="text-amber-500">⚠</span> Alertas de Stock Bajo
          {data.lowStockProducts.length > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {data.lowStockProducts.length}
            </span>
          )}
        </h2>
        {data.lowStockProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay productos bajo el stock mínimo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2 text-left font-medium">SKU</th>
                  <th className="px-4 py-2 text-left font-medium">Nombre</th>
                  <th className="px-4 py-2 text-right font-medium">Stock Actual</th>
                  <th className="px-4 py-2 text-right font-medium">Stock Mínimo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-red-50">
                    <td className="px-4 py-2 font-mono text-primary">{p.sku}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2 text-right font-semibold text-red-600">{p.stock}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{p.minimumStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent movements */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg text-primary mb-4">Últimos 10 Movimientos</h2>
        {data.recentMovements.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay movimientos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2 text-left font-medium">Tipo</th>
                  <th className="px-4 py-2 text-left font-medium">SKU</th>
                  <th className="px-4 py-2 text-right font-medium">Cantidad</th>
                  <th className="px-4 py-2 text-left font-medium">Usuario</th>
                  <th className="px-4 py-2 text-left font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLOR[m.type] ?? 'bg-gray-100 text-gray-700'}`}>
                        {TYPE_LABEL[m.type] ?? m.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-primary">{skuByProductId[m.productId] ?? m.productId.slice(0, 8)}</td>
                    <td className="px-4 py-2 text-right font-medium">{m.quantity}</td>
                    <td className="px-4 py-2 text-gray-700">{m.userName}</td>
                    <td className="px-4 py-2 text-gray-500">{new Date(m.createdAt).toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
