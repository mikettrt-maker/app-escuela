import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

export default function DirectorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Panel del Director</h1>
        <p className="text-sm text-[var(--text-secondary)]">Resumen general de la escuela</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Estudiantes', value: '—', icon: '👨‍🎓' },
          { label: 'Profesores', value: '—', icon: '👨‍🏫' },
          { label: 'Ausentes Hoy', value: '—', icon: '⚠️' },
          { label: 'Avisos Activos', value: '—', icon: '📢' },
        ].map(item => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{item.label}</CardTitle>
              <span className="text-lg">{item.icon}</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
