'use client'

import { signOut } from '@/lib/actions/auth'

export default function PadresLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--gradient)' }}>
              <span className="text-sm font-bold text-white">CE</span>
            </div>
            <span className="text-lg font-bold text-[var(--text-primary)]">CED Escuela - Padres</span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
