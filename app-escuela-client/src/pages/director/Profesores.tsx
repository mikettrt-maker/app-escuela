import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Dialog } from '../../components/ui/Dialog'
import { Input } from '../../components/ui/Input'
import { listTeachers, createTeacherUser, deleteUser } from '../../lib/data'

export default function ProfesoresPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  const load = async () => setTeachers(await listTeachers())
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      await createTeacherUser(
        formData.get('nombre') as string,
        formData.get('email') as string,
        formData.get('password') as string,
      )
      setDialogOpen(false)
      load()
    } catch (err: any) {
      setError(err.message)
    }
    setCreating(false)
  }

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      load()
    } catch {}
  }

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
        <CardHeader><CardTitle>Lista de Profesores</CardTitle></CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay profesores registrados.</p>
          ) : (
            <div className="space-y-2">
              {teachers.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{t.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{t.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => navigate(`/director/profesores/${t.id}/asignar`)}>Asignar Grupos</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>Eliminar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo Profesor">
        <form onSubmit={handleCreate} className="space-y-4">
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
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creando...' : 'Crear Profesor'}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
