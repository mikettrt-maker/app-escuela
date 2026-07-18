import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Dialog } from '../../components/ui/Dialog'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { listParents, createParentUser, deleteUser, listStudentsWithoutParent, linkStudent } from '../../lib/data'

export default function PadresPage() {
  const [parents, setParents] = useState<any[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<any>(null)
  const [availableStudents, setAvailableStudents] = useState<any[]>([])
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  const loadParents = async () => setParents(await listParents())
  useEffect(() => { loadParents() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    const fd = new FormData(e.currentTarget)
    try {
      await createParentUser(fd.get('nombre') as string, fd.get('email') as string, fd.get('password') as string)
      setCreateDialogOpen(false)
      loadParents()
    } catch (err: any) { setError(err.message) }
    setCreating(false)
  }

  const handleDelete = async (userId: string) => {
    try { await deleteUser(userId); loadParents() } catch {}
  }

  const openLinkDialog = async (parent: any) => {
    setSelectedParent(parent)
    setAvailableStudents(await listStudentsWithoutParent())
    setLinkDialogOpen(true)
  }

  const handleLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    try {
      await linkStudent(fd.get('studentId') as string, fd.get('parentId') as string)
      setLinkDialogOpen(false)
      setSelectedParent(null)
      loadParents()
    } catch (err: any) { setError(err.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Padres de Familia</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gestiona los padres registrados</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>+ Nuevo Padre</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Padres</CardTitle></CardHeader>
        <CardContent>
          {parents.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay padres registrados.</p>
          ) : (
            <div className="space-y-2">
              {parents.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{p.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{p.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="secondary" onClick={() => openLinkDialog(p)}>Vincular Estudiante</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Eliminar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} title="Nuevo Padre">
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
            <Button type="button" variant="ghost" onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creando...' : 'Crear Padre'}</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={linkDialogOpen} onClose={() => { setLinkDialogOpen(false); setSelectedParent(null) }}
        title={`Vincular Estudiante - ${selectedParent?.nombre || ''}`}>
        <form onSubmit={handleLink} className="space-y-4">
          <input type="hidden" name="parentId" value={selectedParent?.id || ''} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Estudiante</label>
            <Select name="studentId" required>
              <option value="">Seleccionar estudiante</option>
              {availableStudents.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </Select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => { setLinkDialogOpen(false); setSelectedParent(null) }}>Cancelar</Button>
            <Button type="submit">Vincular</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
