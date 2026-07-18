import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { listAsistencias } from '../../lib/data'

export default function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState<any[]>([])
  const [fecha, setFecha] = useState('')

  const load = async (f?: string) => setAsistencias(await listAsistencias(f || undefined))
  useEffect(() => { load() }, [])

  useEffect(() => {
    const timer = setTimeout(() => load(fecha || undefined), 300)
    return () => clearTimeout(timer)
  }, [fecha])

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'presente': return 'text-green-400'
      case 'ausente': return 'text-red-400'
      case 'tardanza': return 'text-yellow-400'
      default: return 'text-[var(--text-primary)]'
    }
  }

  const estadoLabel = (estado: string) => {
    switch (estado) {
      case 'presente': return 'Presente'
      case 'ausente': return 'Ausente'
      case 'tardanza': return 'Tardanza'
      default: return estado
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Asistencias</h1>
          <p className="text-sm text-[var(--text-secondary)]">Visualiza el reporte de asistencias</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-48" />
          {fecha && <Button variant="ghost" size="sm" onClick={() => setFecha('')}>Limpiar</Button>}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Reporte de Asistencias</CardTitle></CardHeader>
        <CardContent>
          {asistencias.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay registros de asistencia.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="pb-3 pr-4 text-[var(--text-secondary)] font-medium">Estudiante</th>
                    <th className="pb-3 pr-4 text-[var(--text-secondary)] font-medium">Fecha</th>
                    <th className="pb-3 text-[var(--text-secondary)] font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.map(a => (
                    <tr key={a.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--text-primary)]">{a.student?.nombre}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{a.fecha}</td>
                      <td className={`py-3 font-medium ${estadoColor(a.estado)}`}>{estadoLabel(a.estado)}</td>
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
