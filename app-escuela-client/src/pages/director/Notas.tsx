import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { listNotas } from '../../lib/data'

export default function NotasPage() {
  const [notas, setNotas] = useState<any[]>([])
  const [fecha, setFecha] = useState('')

  const load = async (f?: string) => setNotas(await listNotas(f || undefined))
  useEffect(() => { load() }, [])

  useEffect(() => {
    const timer = setTimeout(() => load(fecha || undefined), 300)
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
          <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-48" />
          {fecha && <Button variant="ghost" size="sm" onClick={() => setFecha('')}>Limpiar</Button>}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Registro de Notas</CardTitle></CardHeader>
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
                  {notas.map(n => (
                    <tr key={n.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--text-primary)]">{n.student?.nombre}</td>
                      <td className="py-3 pr-4 text-[var(--text-primary)]">{n.materia}</td>
                      <td className="py-3 pr-4 text-[var(--text-primary)]">{n.calificacion}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{n.fecha}</td>
                      <td className="py-3 text-[var(--text-secondary)]">{n.comentario || '-'}</td>
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
