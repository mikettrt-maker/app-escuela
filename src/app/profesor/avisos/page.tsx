'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createAdminClient } from '@/lib/supabase/admin'

export default function ProfesorAvisosPage() {
  const [avisos, setAvisos] = useState<any[]>([])

  useEffect(() => {
    const admin = createAdminClient()
    admin
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
        <Card>
          <CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
            No hay avisos disponibles.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {avisos.map(aviso => (
            <Card key={aviso.id}>
              <CardHeader>
                <CardTitle>{aviso.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)]">{aviso.contenido}</p>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {aviso.author?.nombre} · {new Date(aviso.created_at).toLocaleDateString('es-MX')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
