import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Layout } from './Layout'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole: string
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false)
        return
      }
      setSession(session)
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data)
          setLoading(false)
        })
    })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient)' }}>
            CE
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session || !profile) {
    return <Navigate to="/login" replace />
  }

  if (profile.role !== allowedRole) {
    const redirect = profile.role === 'director' ? '/director' : profile.role === 'teacher' ? '/profesor' : '/padres'
    return <Navigate to={redirect} replace />
  }

  return <Layout role={profile.role} userName={profile.nombre || profile.email}>{children}</Layout>
}
