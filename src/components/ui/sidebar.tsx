'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@/components/sign-out-button'

const navItems = [
  { href: '/director', label: 'Dashboard', icon: '📊' },
  { href: '/director/estudiantes', label: 'Estudiantes', icon: '👨‍🎓' },
  { href: '/director/profesores', label: 'Profesores', icon: '👨‍🏫' },
  { href: '/director/padres', label: 'Padres', icon: '👪' },
  { href: '/director/notas', label: 'Notas del Día', icon: '📝' },
  { href: '/director/asistencias', label: 'Asistencias', icon: '✅' },
  { href: '/director/avisos', label: 'Avisos', icon: '📢' },
]

export function Sidebar({ userName, userEmail }: { userName?: string; userEmail?: string }) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--gradient)' }}>
          <span className="text-sm font-bold text-white">CE</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-[var(--text-primary)]">CED Escuela</span>
          {userName && <span className="text-xs text-[var(--text-secondary)]">{userName}</span>}
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
              )}
              style={isActive ? { background: 'var(--gradient)' } : undefined}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <SignOutButton />
      </div>
    </aside>
  )
}
