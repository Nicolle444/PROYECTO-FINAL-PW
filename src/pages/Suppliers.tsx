import { useEffect, useState, FormEvent } from 'react'
import api from '../api/axios'
import { Supplier } from '../types'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

interface SupplierForm {
  name: string; contactName: string; email: string; phone: string; address: string
}
const emptyForm: SupplierForm = { name: '', contactName: '', email: '', phone: '', address: '' }

export default function Suppliers() {
  const { user } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState<SupplierForm>(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const isAdminOrGerente = user?.role === 'ADMIN' || user?.role === 'GERENTE_COMPRAS'
  const isAdmin = user?.role === 'ADMIN'

  const fetchSuppliers = async () => {
    const res = await api.get<Supplier[]>('/api/v1/suppliers')
    setSuppliers(res.data)
  }

  useEffect(() => {
    void fetchSuppliers().finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setShowModal(true) }
  const openEdit = (s: Supplier) => {
    setEditing(s)
    setForm({ name: s.name, contactName: s.contactName, email: s.email, phone: s.phone, address: s.address })
    setFormError('')
    setShowModal(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setFormError(''); setSaving(true)
    try {
      if (editing) await api.put(`/api/v1/suppliers/${editing.id}`, form)
      else await api.post('/api/v1/suppliers', form)
      setShowModal(false)
      await fetchSuppliers()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setFormError((err.response?.data as { message?: string })?.message ?? 'Error al guardar')
      else setFormError('Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return
    try { await api.delete(`/api/v1/suppliers/${id}`); await fetchSuppliers() } catch { /* noop */ }
  }

  const f = (key: keyof SupplierForm, v: string) => setForm((p) => ({ ...p, [key]: v }))

  if (loading) return <div className="flex justify-center py-20 text-primary font-medium">Cargando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-anton text-3xl text-primary tracking-wide">PROVEEDORES</h1>
        {isAdminOrGerente && (
          <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm">+ Nuevo Proveedor</button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Contacto</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium">Dirección</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No hay proveedores</td></tr>
              ) : suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.contactName}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{s.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {isAdminOrGerente && <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline text-xs font-medium">Editar</button>}
                      {isAdmin && <button onClick={() => void handleDelete(s.id)} className="text-red-600 hover:underline text-xs font-medium">Eliminar</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="bg-primary text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="font-anton text-xl tracking-wide">{editing ? 'EDITAR PROVEEDOR' : 'NUEVO PROVEEDOR'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={(e) => void handleSave(e)} className="p-6 space-y-3">
              {(['name', 'contactName', 'email', 'phone', 'address'] as (keyof SupplierForm)[]).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key === 'contactName' ? 'Nombre del Contacto' : key === 'name' ? 'Nombre' : key === 'email' ? 'Email' : key === 'phone' ? 'Teléfono' : 'Dirección'} *</label>
                  <input value={form[key]} onChange={(e) => f(key, e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
              {formError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{formError}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
