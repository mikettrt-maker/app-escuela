import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Icon, Logo } from './ui/Icon'

interface LayoutProps {
  children: React.ReactNode
  role: string
  userName: string
}

const directorLinks = [
  { path: '/director', label: 'Dashboard', icon: 'dashboard' as const },
  { path: '/director/estudiantes', label: 'Estudiantes', icon: 'students' as const },
  { path: '/director/profesores', label: 'Profesores', icon: 'teachers' as const },
  { path: '/director/padres', label: 'Padres', icon: 'parents' as const },
  { path: '/director/notas', label: 'Notas del Día', icon: 'notas' as const },
  { path: '/director/asistencias', label: 'Asistencias', icon: 'attendance' as const },
  { path: '/director/avisos', label: 'Avisos', icon: 'avisos' as const },
]

const teacherLinks = [
  { path: '/profesor', label: 'Notas del Día', icon: 'notas' as const },
  { path: '/profesor/avisos', label: 'Avisos', icon: 'avisos' as const },
]

const parentLinks = [
  { path: '/padres', label: 'Dashboard', icon: 'dashboard' as const },
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
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[var(--surface)] border-r border-[var(--border)] transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border)]">
            <Logo size={40} />
            <div>
              <p className="text-base font-bold text-[var(--text-primary)]">CED Escuela</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate max-w-[160px]">{userName}</p>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {links.map(link => {
              const isActive = location.pathname === link.path
              return (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-white shadow-lg shadow-purple-500/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                  }`}
                  style={isActive ? { background: 'var(--gradient)' } : undefined}
                >
                  <Icon name={link.icon} size={20} />
                  <span>{link.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-3 border-t border-[var(--border)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Icon name="logout" size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)] px-4 lg:px-8 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--text-secondary)] p-2 hover:text-[var(--text-primary)]">
            <Icon name="menu" size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[120px]">{userName}</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-[var(--text-secondary)] hover:text-red-400 font-medium px-2 py-1">Salir</button>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
