import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Icon } from '../../components/ui/Icon'

export default function DirectorDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Panel del Director</h1>
        <p className="text-base text-[var(--text-secondary)] mt-1">Resumen general de la escuela</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Estudiantes', value: '—', icon: 'students' as const },
          { label: 'Profesores', value: '—', icon: 'teachers' as const },
          { label: 'Ausentes Hoy', value: '—', icon: 'attendance' as const },
          { label: 'Avisos Activos', value: '—', icon: 'avisos' as const },
        ].map(item => (
          <Card key={item.label} className="hover:border-[var(--secondary)]/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{item.label}</CardTitle>
              <div className="text-[var(--secondary)] opacity-70">
                <Icon name={item.icon} size={24} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--text-primary)]">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
