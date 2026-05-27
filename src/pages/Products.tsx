import { useEffect, useState, FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import { Product, Supplier } from '../types'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

interface ProductForm {
  sku: string
  name: string
  description: string
  supplierId: string
  warehouseLocation: string
  stock: number
  minimumStock: number
  acquisitionCost: number
}

const emptyForm: ProductForm = {
  sku: '', name: '', description: '', supplierId: '',
  warehouseLocation: '', stock: 0, minimumStock: 0, acquisitionCost: 0,
}

export default function Products() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const isAdminOrGerente = user?.role === 'ADMIN' || user?.role === 'GERENTE_COMPRAS'
  const isAdmin = user?.role === 'ADMIN'

  const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s.name]))

  const fetchProducts = async () => {
    try {
      const url = search ? `/api/v1/products/search?q=${encodeURIComponent(search)}` : '/api/v1/products'
      const res = await api.get<Product[]>(url)
      setProducts(res.data)
    } catch {
      setProducts([])
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const [suppRes] = await Promise.all([api.get<Supplier[]>('/api/v1/suppliers')])
        setSuppliers(suppRes.data)
      } catch { /* noop */ }
      await fetchProducts()
      setLoading(false)
    }
    void init()
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    void fetchProducts()
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      sku: p.sku, name: p.name, description: p.description,
      supplierId: p.supplierId, warehouseLocation: p.warehouseLocation,
      stock: p.stock, minimumStock: p.minimumStock, acquisitionCost: p.acquisitionCost,
    })
    setFormError('')
    setShowModal(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/api/v1/products/${editing.id}`, {
          sku: form.sku, name: form.name, description: form.description,
          supplierId: form.supplierId, warehouseLocation: form.warehouseLocation,
          minimumStock: form.minimumStock, acquisitionCost: form.acquisitionCost,
        })
      } else {
        await api.post('/api/v1/products', form)
      }
      setShowModal(false)
      await fetchProducts()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setFormError((err.response?.data as { message?: string })?.message ?? 'Error al guardar')
      } else {
        setFormError('Error al guardar')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await api.delete(`/api/v1/products/${id}`)
      await fetchProducts()
    } catch { /* noop */ }
  }

  const f = (key: keyof ProductForm, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  if (loading) return <div className="flex justify-center py-20 text-primary font-medium">Cargando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-anton text-3xl text-primary tracking-wide">PRODUCTOS</h1>
        {isAdminOrGerente && (
          <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm">
            + Nuevo Producto
          </button>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por SKU o nombre..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1 max-w-sm"
        />
        <button type="submit" className="bg-accent text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-400">Buscar</button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); void fetchProducts() }} className="text-sm text-gray-500 hover:text-gray-700 px-2">✕ Limpiar</button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left font-medium">SKU</th>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Proveedor</th>
                <th className="px-4 py-3 text-left font-medium">Ubicación</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Mín.</th>
                <th className="px-4 py-3 text-right font-medium">Costo</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No hay productos</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className={`hover:bg-secondary/30 ${p.stock <= p.minimumStock ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 font-mono text-primary font-medium">{p.sku}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{supplierMap[p.supplierId] ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.warehouseLocation}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.stock <= p.minimumStock ? 'text-red-600' : 'text-gray-800'}`}>{p.stock}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{p.minimumStock}</td>
                  <td className="px-4 py-3 text-right">${p.acquisitionCost.toLocaleString('es-CO')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/products/${p.id}/kardex`} className="text-primary hover:underline text-xs font-medium">Kardex</Link>
                      {isAdminOrGerente && (
                        <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs font-medium">Editar</button>
                      )}
                      {isAdmin && (
                        <button onClick={() => void handleDelete(p.id)} className="text-red-600 hover:underline text-xs font-medium">Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-primary text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="font-anton text-xl tracking-wide">{editing ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={(e) => void handleSave(e)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input value={form.sku} onChange={(e) => f('sku', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input value={form.name} onChange={(e) => f('name', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.description} onChange={(e) => f('description', e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
                <select value={form.supplierId} onChange={(e) => f('supplierId', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Seleccionar proveedor...</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación en Bodega *</label>
                <input value={form.warehouseLocation} onChange={(e) => f('warehouseLocation', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock inicial</label>
                    <input type="number" min={0} value={form.stock} onChange={(e) => f('stock', Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock mínimo</label>
                  <input type="number" min={0} value={form.minimumStock} onChange={(e) => f('minimumStock', Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo ($)</label>
                  <input type="number" min={0} step="0.01" value={form.acquisitionCost} onChange={(e) => f('acquisitionCost', Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              {formError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{formError}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
