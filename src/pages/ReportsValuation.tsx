import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Product, Supplier } from '../types'

export default function ReportsValuation() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const [prodRes, suppRes] = await Promise.all([
          api.get<Product[]>('/api/v1/products'),
          api.get<Supplier[]>('/api/v1/suppliers'),
        ])
        setProducts(prodRes.data)
        setSuppliers(suppRes.data)
      } catch {
        setError('Error al cargar el reporte')
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s.name]))

  const totalValue = products.reduce((sum, p) => sum + p.stock * p.acquisitionCost, 0)
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0)

  if (loading) return <div className="flex justify-center py-20 text-primary font-medium">Cargando...</div>
  if (error) return <div className="text-red-600 text-center py-20">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-anton text-3xl text-primary tracking-wide">REPORTE DE VALORACIÓN</h1>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-primary">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Valor Total</p>
          <p className="font-anton text-2xl text-primary mt-1">${totalValue.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-accent">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Productos</p>
          <p className="font-anton text-2xl text-primary mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-secondary">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Unidades Totales</p>
          <p className="font-anton text-2xl text-primary mt-1">{totalUnits.toLocaleString('es-CO')}</p>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left font-medium">SKU</th>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Proveedor</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Costo Unit.</th>
                <th className="px-4 py-3 text-right font-medium">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const value = p.stock * p.acquisitionCost
                return (
                  <tr key={p.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-primary">{p.sku}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{supplierMap[p.supplierId] ?? '—'}</td>
                    <td className="px-4 py-3 text-right">{p.stock}</td>
                    <td className="px-4 py-3 text-right">${p.acquisitionCost.toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">${value.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-primary/10 font-semibold">
                <td className="px-4 py-3 text-primary" colSpan={3}>TOTAL GENERAL</td>
                <td className="px-4 py-3 text-right text-primary">{totalUnits}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-primary font-bold">${totalValue.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
