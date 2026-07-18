'use client'

import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { createTeacher, deleteUser } from '@/lib/actions/admin'
import { listTeachers } from '@/lib/data'

export default function ProfesoresPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const [createState, createAction, isCreating] = useActionState(createTeacher, null)

  const loadTeachers = async () => {
    const data = await listTeachers()
    setTeachers(data)
  }

  useEffect(() => { loadTeachers() }, [])

  useEffect(() => {
    if (createState?.success) {
      setDialogOpen(false)
      loadTeachers()
    }
  }, [createState])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Profesores</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gestiona los profesores registrados</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>+ Nuevo Profesor</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay profesores registrados.</p>
          ) : (
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{teacher.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{teacher.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => router.push(`/director/profesores/${teacher.id}/asignar`)}>
                      Asignar Grupos
                    </Button>
                    <form action={async (formData) => {
                      formData.set('userId', teacher.id)
                      const result = await deleteUser(null, formData)
                      if (result.success) loadTeachers()
                    }}>
                      <Button size="sm" variant="danger" type="submit">Eliminar</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo Profesor">
        <form action={createAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nombre</label>
            <Input name="nombre" required placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email</label>
            <Input name="email" type="email" required placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Contraseña</label>
            <Input name="password" type="password" required placeholder="Contraseña temporal" />
          </div>
          {createState?.error && (
            <p className="text-sm text-red-400">{createState.error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear Profesor'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
