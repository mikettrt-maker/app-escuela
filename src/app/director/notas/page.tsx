import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notas del Día</h1>
          <p className="text-sm text-[var(--text-secondary)]">Registra las notas diarias de los estudiantes</p>
        </div>
        <Button>+ Nueva Nota</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí podrás registrar las notas del día para cada estudiante.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
