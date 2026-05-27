import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError((err.response?.data as { message?: string })?.message ?? 'Credenciales incorrectas')
      } else {
        setError('Error al conectar con el servidor')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header card */}
        <div className="bg-primary rounded-t-2xl px-8 py-6 text-center">
          <h1 className="font-anton text-white text-3xl tracking-widest">INVENTARIO</h1>
          <p className="text-accent font-anton text-xl tracking-widest">PyME</p>
          <p className="text-secondary text-sm mt-1">Sistema de Control de Inventarios</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-b-2xl shadow-xl px-8 py-8">
          <h2 className="text-xl font-semibold text-primary mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@pyme.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-black font-semibold py-2.5 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-gray-500 text-center">Usuarios de prueba</p>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Admin:</span> admin@pyme.com / admin123</p>
              <p><span className="font-medium">Gerente:</span> gerente@pyme.com / gerente123</p>
              <p><span className="font-medium">Operario:</span> operario@pyme.com / operario123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
