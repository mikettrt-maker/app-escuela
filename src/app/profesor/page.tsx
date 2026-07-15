import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfesorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Panel del Profesor</h1>
        <p className="text-sm text-[var(--text-secondary)]">Notas del día y avisos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notas del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí aparecerán las notas del día registradas por el director.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avisos de Dirección</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí aparecerán los avisos publicados por la dirección.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
