import { useState, FormEvent } from 'react'
import api from '../api/axios'
import { Product } from '../types'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const REASONS = ['Pérdida', 'Daño', 'Conteo físico', 'Corrección de error', 'Otro']

export default function StockAdjust() {
  const { user } = useAuth()
  const [skuSearch, setSkuSearch] = useState('')
  const [product, setProduct] = useState<Product | null>(null)
  const [searchError, setSearchError] = useState('')
  const [newStock, setNewStock] = useState(0)
  const [justification, setJustification] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const searchProduct = async () => {
    setSearchError(''); setProduct(null)
    if (!skuSearch.trim()) return
    try {
      const res = await api.get<Product[]>(`/api/v1/products/search?q=${encodeURIComponent(skuSearch)}`)
      const found = res.data.find((p) => p.sku.toLowerCase() === skuSearch.toLowerCase())
      if (found) { setProduct(found); setNewStock(found.stock) }
      else setSearchError('Producto no encontrado con ese SKU')
    } catch { setSearchError('Error al buscar producto') }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!product) return
    if (justification.length < 10) { setError('El motivo debe tener al menos 10 caracteres'); return }
    setError(''); setSuccess(''); setSaving(true)
    try {
      await api.post('/api/v1/stock/adjust', {
        productId: product.id,
        newStock,
        justification,
        userId: user?.id,
      })
      setSuccess(`Stock ajustado a ${newStock} unidades para ${product.name}.`)
      setProduct(null); setSkuSearch(''); setNewStock(0); setJustification('')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setError((err.response?.data as { message?: string })?.message ?? 'Error al ajustar')
      else setError('Error al ajustar')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="font-anton text-3xl text-primary tracking-wide">AJUSTE DE STOCK</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-3">
        <h2 className="font-semibold text-primary">Buscar Producto por SKU</h2>
        <div className="flex gap-2">
          <input
            value={skuSearch} onChange={(e) => setSkuSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void searchProduct() } }}
            placeholder="Ej: PROD-001"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="button" onClick={() => void searchProduct()} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">Buscar</button>
        </div>
        {searchError && <p className="text-red-600 text-sm">{searchError}</p>}
        {product && (
          <div className="bg-secondary/40 rounded-lg p-3 text-sm space-y-1">
            <p><span className="font-medium">SKU:</span> {product.sku}</p>
            <p><span className="font-medium">Nombre:</span> {product.name}</p>
            <p><span className="font-medium">Stock actual:</span> <strong className="text-primary">{product.stock}</strong></p>
          </div>
        )}
      </div>

      {product && (
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo stock *</label>
              <input
                type="number" min={0} value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-400 mt-1">Diferencia: {newStock - product.stock >= 0 ? '+' : ''}{newStock - product.stock} unidades</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del ajuste *</label>
              <select
                value={justification} onChange={(e) => setJustification(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
              >
                <option value="">Seleccionar motivo...</option>
                {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <textarea
                value={justification} onChange={(e) => setJustification(e.target.value)} required rows={3}
                placeholder="Describe el motivo del ajuste (mín. 10 caracteres)..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-400 mt-1">{justification.length}/10 caracteres mínimo</p>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">{success}</div>}
            <button type="submit" disabled={saving} className="w-full bg-accent text-black font-semibold py-2.5 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-60">
              {saving ? 'Ajustando...' : 'Registrar Ajuste'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
