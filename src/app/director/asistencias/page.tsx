import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AsistenciasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Asistencias</h1>
        <p className="text-sm text-[var(--text-secondary)]">Visualiza el reporte de asistencias</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporte de Asistencias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí podrás ver el reporte de asistencias por grupo y fecha.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
