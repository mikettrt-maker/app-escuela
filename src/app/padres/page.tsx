import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PadresDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Panel de Padres</h1>
        <p className="text-sm text-[var(--text-secondary)]">Consulta la información de tus hijos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Notas del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Consulta las notas y comentarios del día de tus hijos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asistencias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Revisa el registro de asistencias de tus hijos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avisos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Lee los comunicados importantes de la dirección.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
