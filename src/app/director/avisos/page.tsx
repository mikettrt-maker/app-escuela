import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AvisosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Avisos</h1>
          <p className="text-sm text-[var(--text-secondary)]">Publica avisos para padres y profesores</p>
        </div>
        <Button>+ Nuevo Aviso</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Avisos Publicados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Aquí se mostrarán los avisos publicados por dirección.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
