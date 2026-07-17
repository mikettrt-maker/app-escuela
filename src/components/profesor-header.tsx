'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@/components/sign-out-button'

export function ProfesorHeader({ userName }: { userName?: string }) {
  const pathname = usePathname()

  const tabs = [
    { href: '/profesor', label: 'Notas del Día' },
    { href: '/profesor/avisos', label: 'Avisos' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--gradient)' }}>
              <span className="text-sm font-bold text-white">CE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[var(--text-primary)]">CED Escuela</span>
              {userName && <span className="text-xs text-[var(--text-secondary)]">{userName}</span>}
            </div>
          </div>
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === tab.href
                    ? 'text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
                style={pathname === tab.href ? { background: 'var(--gradient)' } : undefined}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <SignOutButton />
      </div>
    </header>
  )
}
