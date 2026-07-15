import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AvisosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Avisos de Dirección</h1>
        <p className="text-sm text-[var(--text-secondary)]">Comunicados oficiales</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Avisos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            No hay avisos nuevos. Los comunicados de dirección aparecerán aquí.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
