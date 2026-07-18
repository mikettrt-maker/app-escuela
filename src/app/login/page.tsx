'use client'

import { useActionState, useEffect } from 'react'
import { login } from '@/lib/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  useEffect(() => {
    if (state?.success && state.redirect) {
      window.location.href = state.redirect
    }
  }, [state])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'var(--gradient)' }}
          >
            <span className="text-2xl font-bold text-white">CE</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">CED Escuela</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Inicia sesión para continuar
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="tu@correo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="••••••••"
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm text-[var(--error)]">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: 'var(--gradient)' }}
            >
              {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
