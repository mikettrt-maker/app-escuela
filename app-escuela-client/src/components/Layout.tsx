import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface LayoutProps {
  children: React.ReactNode
  role: string
  userName: string
}

const directorLinks = [
  { path: '/director', label: 'Dashboard', icon: '📊' },
  { path: '/director/estudiantes', label: 'Estudiantes', icon: '👨‍🎓' },
  { path: '/director/profesores', label: 'Profesores', icon: '👨‍🏫' },
  { path: '/director/padres', label: 'Padres', icon: '👪' },
  { path: '/director/notas', label: 'Notas del Día', icon: '📝' },
  { path: '/director/asistencias', label: 'Asistencias', icon: '✅' },
  { path: '/director/avisos', label: 'Avisos', icon: '📢' },
]

const teacherLinks = [
  { path: '/profesor', label: 'Notas del Día', icon: '📝' },
  { path: '/profesor/avisos', label: 'Avisos', icon: '📢' },
]

const parentLinks = [
  { path: '/padres', label: 'Dashboard', icon: '🏠' },
]

export function Layout({ children, role, userName }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const links = role === 'director' ? directorLinks : role === 'teacher' ? teacherLinks : parentLinks

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[var(--surface)] border-r border-[var(--border)] transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--border)]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--gradient)' }}>
              CE
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">CED Escuela</p>
              <p className="text-xs text-[var(--text-secondary)]">{userName}</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map(link => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'text-white font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                }`}
                style={location.pathname === link.path ? { background: 'var(--gradient)' } : undefined}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[var(--background)] border-b border-[var(--border)] px-4 lg:px-6 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--text-secondary)] text-xl">
            ☰
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: 'var(--gradient)' }}>
              CE
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{userName}</span>
          </div>
          <button onClick={handleLogout} className="text-[var(--text-secondary)] text-sm">Salir</button>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
