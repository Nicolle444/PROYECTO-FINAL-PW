import { useEffect, useState, FormEvent } from 'react'
import api from '../api/axios'
import { UserData, UserRole } from '../types'
import axios from 'axios'

interface UserForm {
  name: string; email: string; password: string; role: UserRole
}
const emptyForm: UserForm = { name: '', email: '', password: '', role: 'OPERARIO_BODEGA' }

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  GERENTE_COMPRAS: 'Gerente de Compras',
  OPERARIO_BODEGA: 'Operario de Bodega',
}

const ROLE_COLOR: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  GERENTE_COMPRAS: 'bg-blue-100 text-blue-800',
  OPERARIO_BODEGA: 'bg-green-100 text-green-800',
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<UserData | null>(null)
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    const res = await api.get<UserData[]>('/api/v1/users')
    setUsers(res.data)
  }

  useEffect(() => {
    void fetchUsers().finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setShowModal(true) }
  const openEdit = (u: UserData) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, password: '', role: u.role })
    setFormError('')
    setShowModal(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setFormError(''); setSaving(true)
    try {
      if (editing) {
        const payload: Partial<UserForm> = { name: form.name, email: form.email, role: form.role }
        if (form.password) payload.password = form.password
        await api.put(`/api/v1/users/${editing.id}`, payload)
      } else {
        await api.post('/api/v1/users', form)
      }
      setShowModal(false)
      await fetchUsers()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setFormError((err.response?.data as { message?: string })?.message ?? 'Error al guardar')
      else setFormError('Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este usuario?')) return
    try { await api.delete(`/api/v1/users/${id}`); await fetchUsers() } catch { /* noop */ }
  }

  const f = <K extends keyof UserForm>(key: K, value: UserForm[K]) =>
    setForm((p) => ({ ...p, [key]: value }))

  if (loading) return <div className="flex justify-center py-20 text-primary font-medium">Cargando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-anton text-3xl text-primary tracking-wide">USUARIOS</h1>
        <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm">+ Nuevo Usuario</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Rol</th>
                <th className="px-4 py-3 text-left font-medium">Creado</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No hay usuarios</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLOR[u.role]}`}>
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('es-CO')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline text-xs font-medium">Editar</button>
                      <button onClick={() => void handleDelete(u.id)} className="text-red-600 hover:underline text-xs font-medium">Eliminar</button>
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
              <h2 className="font-anton text-xl tracking-wide">{editing ? 'EDITAR USUARIO' : 'NUEVO USUARIO'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={(e) => void handleSave(e)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input value={form.name} onChange={(e) => f('name', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => f('email', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {editing ? '(dejar vacío para no cambiar)' : '*'}
                </label>
                <input
                  type="password" value={form.password} onChange={(e) => f('password', e.target.value)}
                  required={!editing} placeholder={editing ? '••••••••' : ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                <select value={form.role} onChange={(e) => f('role', e.target.value as UserRole)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="ADMIN">Administrador</option>
                  <option value="GERENTE_COMPRAS">Gerente de Compras</option>
                  <option value="OPERARIO_BODEGA">Operario de Bodega</option>
                </select>
              </div>
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
