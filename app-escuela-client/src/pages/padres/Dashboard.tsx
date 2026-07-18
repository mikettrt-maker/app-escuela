import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function PadresDashboard() {
  const [children, setChildren] = useState<any[]>([])
  const [notas, setNotas] = useState<any[]>([])
  const [asistencias, setAsistencias] = useState<any[]>([])
  const [avisos, setAvisos] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      supabase.from('estudiantes').select('*').eq('parent_id', user.id).order('nombre').then(({ data }) => {
        setChildren(data || [])
        if (data && data.length > 0) {
          const ids = data.map(c => c.id)

          supabase.from('notas_diarias').select('*, student:student_id(nombre)')
            .in('student_id', ids).order('created_at', { ascending: false }).limit(20)
            .then(({ data: n }) => setNotas(n || []))

          supabase.from('asistencias').select('*, student:student_id(nombre)')
            .in('student_id', ids).order('created_at', { ascending: false }).limit(20)
            .then(({ data: a }) => setAsistencias(a || []))
        }
      })

      supabase.from('avisos').select('*, author:created_by(nombre)')
        .in('target', ['parents', 'all']).order('created_at', { ascending: false })
        .then(({ data }) => setAvisos(data || []))
    })
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Panel de Padres</h1>

      <Card>
        <CardHeader><CardTitle>Mis Hijos</CardTitle></CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay hijos vinculados a tu cuenta.</p>
          ) : (
            <div className="space-y-2">
              {children.map(child => (
                <div key={child.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{child.nombre}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Grado: {child.grado}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notas Recientes</CardTitle></CardHeader>
        <CardContent>
          {notas.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay notas registradas.</p>
          ) : (
            <div className="space-y-2">
              {notas.map(n => (
                <div key={n.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2">
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{n.student?.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{n.materia} · {new Date(n.fecha).toLocaleDateString('es-MX')}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: n.calificacion >= 6 ? '#22c55e' : '#ef4444' }}>{n.calificacion}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Asistencias Recientes</CardTitle></CardHeader>
        <CardContent>
          {asistencias.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay asistencias registradas.</p>
          ) : (
            <div className="space-y-2">
              {asistencias.map(a => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2">
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{a.student?.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{new Date(a.fecha).toLocaleDateString('es-MX')}</p>
                  </div>
                  <span className={`text-sm font-medium ${a.estado === 'presente' ? 'text-green-400' : a.estado === 'tardanza' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {a.estado === 'presente' ? 'Presente' : a.estado === 'ausente' ? 'Ausente' : 'Tardanza'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Avisos</CardTitle></CardHeader>
        <CardContent>
          {avisos.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay avisos.</p>
          ) : (
            <div className="space-y-3">
              {avisos.map(a => (
                <div key={a.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{a.titulo}</h4>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{a.contenido}</p>
                  <p className="mt-2 text-xs text-[var(--text-secondary)]">
                    {a.author?.nombre} · {new Date(a.created_at).toLocaleDateString('es-MX')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
