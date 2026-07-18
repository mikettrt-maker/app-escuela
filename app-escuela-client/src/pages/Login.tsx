import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/ui/Icon'

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
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-5">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5">
            <Logo size={72} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">CED Escuela</h1>
          <p className="mt-2 text-base text-[var(--text-secondary)]">Inicia sesión para continuar</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Correo electrónico</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                placeholder="tu@correo.com" required />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Contraseña</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                placeholder="••••••••" required />
            </div>
            {error && <p className="text-sm text-[var(--error)] bg-red-500/10 rounded-lg px-4 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center rounded-xl px-5 py-3 text-base font-semibold text-white transition-all duration-150 disabled:opacity-50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
              style={{ background: 'var(--gradient)' }}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
