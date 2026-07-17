'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { listNotas } from '@/lib/actions/admin'

export default function NotasPage() {
  const [notas, setNotas] = useState<any[]>([])
  const [fecha, setFecha] = useState('')

  const loadNotas = async (f?: string) => {
    const data = await listNotas(f || undefined)
    setNotas(data)
  }

  useEffect(() => { loadNotas() }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotas(fecha || undefined)
    }, 300)
    return () => clearTimeout(timer)
  }, [fecha])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notas del Día</h1>
          <p className="text-sm text-[var(--text-secondary)]">Visualiza el reporte de notas diarias</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-48"
          />
          {fecha && (
            <Button variant="ghost" size="sm" onClick={() => setFecha('')}>
              Limpiar
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Notas</CardTitle>
        </CardHeader>
        <CardContent>
          {notas.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay notas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="pb-3 pr-4 text-[var(--text-secondary)] font-medium">Estudiante</th>
                    <th className="pb-3 pr-4 text-[var(--text-secondary)] font-medium">Materia</th>
                    <th className="pb-3 pr-4 text-[var(--text-secondary)] font-medium">Calificación</th>
                    <th className="pb-3 pr-4 text-[var(--text-secondary)] font-medium">Fecha</th>
                    <th className="pb-3 text-[var(--text-secondary)] font-medium">Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((nota) => (
                    <tr key={nota.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--text-primary)]">{nota.student?.nombre}</td>
                      <td className="py-3 pr-4 text-[var(--text-primary)]">{nota.materia}</td>
                      <td className="py-3 pr-4 text-[var(--text-primary)]">{nota.calificacion}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{nota.fecha}</td>
                      <td className="py-3 text-[var(--text-secondary)]">{nota.comentario || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
