import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PadresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Padres de Familia</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gestiona los padres registrados</p>
        </div>
        <Button>+ Nuevo Padre</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Padres</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí se mostrarán los padres de familia registrados.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
