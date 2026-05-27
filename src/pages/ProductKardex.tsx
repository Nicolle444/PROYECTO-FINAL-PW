import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { Product, StockMovement } from '../types'

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

export default function ProductKardex() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const [prodRes, kardexRes] = await Promise.all([
          api.get<Product>(`/api/v1/products/${id ?? ''}`),
          api.get<StockMovement[]>(`/api/v1/products/${id ?? ''}/kardex`),
        ])
        setProduct(prodRes.data)
        setMovements(kardexRes.data)
      } catch {
        setError('Error al cargar el kardex')
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [id])

  if (loading) return <div className="flex justify-center py-20 text-primary font-medium">Cargando...</div>
  if (error) return <div className="text-red-600 text-center py-20">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/products" className="text-primary hover:underline text-sm">← Volver a Productos</Link>
      </div>

      {product && (
        <div className="bg-white rounded-xl shadow p-5">
          <h1 className="font-anton text-2xl text-primary tracking-wide">KARDEX — {product.sku}</h1>
          <div className="flex flex-wrap gap-6 mt-2 text-sm text-gray-600">
            <span><strong>Nombre:</strong> {product.name}</span>
            <span><strong>Stock actual:</strong> {product.stock}</span>
            <span><strong>Ubicación:</strong> {product.warehouseLocation}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                <th className="px-4 py-3 text-right font-medium">Cantidad</th>
                <th className="px-4 py-3 text-right font-medium">Stock Previo</th>
                <th className="px-4 py-3 text-right font-medium">Saldo Resultante</th>
                <th className="px-4 py-3 text-left font-medium">Motivo</th>
                <th className="px-4 py-3 text-left font-medium">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Sin movimientos registrados</td></tr>
              ) : movements.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(m.createdAt).toLocaleString('es-CO')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLOR[m.type] ?? 'bg-gray-100 text-gray-700'}`}>
                      {TYPE_LABEL[m.type] ?? m.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{m.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{m.previousStock}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">{m.newStock}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{m.justification}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.userId.slice(0, 8)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
