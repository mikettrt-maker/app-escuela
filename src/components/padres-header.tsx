'use client'

import { SignOutButton } from '@/components/sign-out-button'

export function PadresHeader({ userName }: { userName?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--gradient)' }}>
            <span className="text-sm font-bold text-white">CE</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[var(--text-primary)]">CED Escuela - Padres</span>
            {userName && <span className="text-xs text-[var(--text-secondary)]">{userName}</span>}
          </div>
        </div>
        <SignOutButton />
      </div>
    </header>
  )
}
