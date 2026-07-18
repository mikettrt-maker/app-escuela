import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function ProfesorAvisosPage() {
  const [avisos, setAvisos] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('avisos')
      .select('*, author:created_by(nombre)')
      .in('target', ['teachers', 'all'])
      .order('created_at', { ascending: false })
      .then(({ data }) => setAvisos(data || []))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Avisos</h1>
      {avisos.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
          No hay avisos disponibles.
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {avisos.map(a => (
            <Card key={a.id}>
              <CardHeader><CardTitle>{a.titulo}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)]">{a.contenido}</p>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {a.author?.nombre} · {new Date(a.created_at).toLocaleDateString('es-MX')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
