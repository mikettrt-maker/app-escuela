import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EstudiantesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Estudiantes</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gestiona los estudiantes registrados</p>
        </div>
        <Button>+ Nuevo Estudiante</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí se mostrarán los estudiantes registrados. Usa Supabase para agregar datos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
