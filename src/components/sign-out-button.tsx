'use client'

import { useActionState, useEffect } from 'react'
import { signOut } from '@/lib/actions/auth'

export function SignOutButton() {
  const [state, action, pending] = useActionState(signOut, undefined)

  useEffect(() => {
    if (state?.success && state.redirect) {
      window.location.href = state.redirect
    }
  }, [state])

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
      >
        {pending ? 'Saliendo...' : 'Cerrar Sesión'}
      </button>
    </form>
  )
}
