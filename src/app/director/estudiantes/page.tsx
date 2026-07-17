'use client'

import { useEffect, useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createStudent, deleteStudent, listStudents } from '@/lib/actions/admin'

export default function EstudiantesPage() {
  const [students, setStudents] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const [createState, createAction, isCreating] = useActionState(createStudent, null)

  const loadStudents = async () => {
    const data = await listStudents()
    setStudents(data)
  }

  useEffect(() => { loadStudents() }, [])

  useEffect(() => {
    if (createState?.success) {
      setDialogOpen(false)
      loadStudents()
    }
  }, [createState])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Estudiantes</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gestiona los estudiantes registrados</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>+ Nuevo Estudiante</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay estudiantes registrados.</p>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{student.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Grado: {student.grado}
                      {student.parent && ` | Padre: ${student.parent.nombre}`}
                    </p>
                  </div>
                  <form action={async (formData) => {
                    formData.set('id', student.id)
                    const result = await deleteStudent(null, formData)
                    if (result.success) loadStudents()
                  }}>
                    <Button size="sm" variant="danger" type="submit">Eliminar</Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo Estudiante">
        <form action={createAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nombre</label>
            <Input name="nombre" required placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Grado</label>
            <Select name="grado" required>
              <option value="">Seleccionar grado</option>
              <option value="1°">1°</option>
              <option value="2°">2°</option>
              <option value="3°">3°</option>
              <option value="4°">4°</option>
              <option value="5°">5°</option>
              <option value="6°">6°</option>
            </Select>
          </div>
          {createState?.error && (
            <p className="text-sm text-red-400">{createState.error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear Estudiante'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
