import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Dialog } from '../../components/ui/Dialog'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { GRADOS, listStudents, createStudent, deleteStudent } from '../../lib/data'

export default function EstudiantesPage() {
  const [students, setStudents] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  const load = async () => setStudents(await listStudents())
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      await createStudent(fd.get('nombre') as string, fd.get('grado') as string)
      setDialogOpen(false)
      load()
    } catch (err: any) { setError(err.message) }
    setCreating(false)
  }

  const handleDelete = async (id: string) => {
    try { await deleteStudent(id); load() } catch {}
  }

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
        <CardHeader><CardTitle>Lista de Estudiantes</CardTitle></CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay estudiantes registrados.</p>
          ) : (
            <div className="space-y-2">
              {students.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{s.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Grado: {s.grado}{s.parent ? ` | Padre: ${s.parent.nombre}` : ''}</p>
                  </div>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Eliminar</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo Estudiante">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nombre</label>
            <Input name="nombre" required placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Grado</label>
            <Select name="grado" required>
              <option value="">Seleccionar grado</option>
              {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creando...' : 'Crear Estudiante'}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
