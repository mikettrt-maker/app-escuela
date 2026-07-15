import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfesoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Profesores</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gestiona los profesores registrados</p>
        </div>
        <Button>+ Nuevo Profesor</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí se mostrarán los profesores registrados.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
