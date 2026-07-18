import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setError(authError.message); setLoading(false); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (!profile) { setError('Perfil no encontrado'); setLoading(false); return }

      const redirect = profile.role === 'director' ? '/director' : profile.role === 'teacher' ? '/profesor' : '/padres'
      navigate(redirect)
    } catch {
      setError('Error al iniciar sesión')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'var(--gradient)' }}>
            <span className="text-2xl font-bold text-white">CE</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">CED Escuela</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Inicia sesión para continuar</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Correo electrónico</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="tu@correo.com" required />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Contraseña</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="••••••••" required />
            </div>
            {error && <p className="text-sm text-[var(--error)]">{error}</p>}
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: 'var(--gradient)' }}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
