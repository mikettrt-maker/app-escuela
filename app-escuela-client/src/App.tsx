import React, { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/Login'
import DirectorDashboard from './pages/director/Dashboard'
import ProfesoresPage from './pages/director/Profesores'
import AsignarPage from './pages/director/Asignar'
import EstudiantesPage from './pages/director/Estudiantes'
import PadresPage from './pages/director/Padres'
import AvisosPage from './pages/director/Avisos'
import NotasPage from './pages/director/Notas'
import AsistenciasPage from './pages/director/Asistencias'
import ProfesorNotasPage from './pages/profesor/NotasPage'
import ProfesorAvisosPage from './pages/profesor/Avisos'
import PadresDashboard from './pages/padres/Dashboard'

function RootRedirect() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setLoading(false); return }
      supabase.from('profiles').select('role').eq('id', session.user.id).single()
        .then(({ data }) => {
          setRole(data?.role || null)
          setLoading(false)
        })
    })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient)' }}>CE</div>
      </div>
    )
  }

  if (!role) return <Navigate to="/login" replace />
  const redirect = role === 'director' ? '/director' : role === 'teacher' ? '/profesor' : '/padres'
  return <Navigate to={redirect} replace />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/director" element={<ProtectedRoute allowedRole="director"><DirectorDashboard /></ProtectedRoute>} />
        <Route path="/director/profesores" element={<ProtectedRoute allowedRole="director"><ProfesoresPage /></ProtectedRoute>} />
        <Route path="/director/profesores/:id/asignar" element={<ProtectedRoute allowedRole="director"><AsignarPage /></ProtectedRoute>} />
        <Route path="/director/estudiantes" element={<ProtectedRoute allowedRole="director"><EstudiantesPage /></ProtectedRoute>} />
        <Route path="/director/padres" element={<ProtectedRoute allowedRole="director"><PadresPage /></ProtectedRoute>} />
        <Route path="/director/avisos" element={<ProtectedRoute allowedRole="director"><AvisosPage /></ProtectedRoute>} />
        <Route path="/director/notas" element={<ProtectedRoute allowedRole="director"><NotasPage /></ProtectedRoute>} />
        <Route path="/director/asistencias" element={<ProtectedRoute allowedRole="director"><AsistenciasPage /></ProtectedRoute>} />

        <Route path="/profesor" element={<ProtectedRoute allowedRole="teacher"><ProfesorNotasPage /></ProtectedRoute>} />
        <Route path="/profesor/avisos" element={<ProtectedRoute allowedRole="teacher"><ProfesorAvisosPage /></ProtectedRoute>} />

        <Route path="/padres" element={<ProtectedRoute allowedRole="parent"><PadresDashboard /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  )
}
