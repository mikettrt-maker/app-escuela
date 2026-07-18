'use client'

import { useEffect, useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createParent, deleteParent, listParents, listStudentsWithoutParent, linkStudentToParent } from '@/lib/actions/admin'

export default function PadresPage() {
  const [parents, setParents] = useState<any[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<any>(null)
  const [availableStudents, setAvailableStudents] = useState<any[]>([])

  const [createState, createAction, isCreating] = useActionState(createParent, null)
  const [linkState, linkAction, isLinking] = useActionState(linkStudentToParent, null)

  const loadParents = async () => {
    const data = await listParents()
    setParents(data)
  }

  const loadAvailableStudents = async () => {
    const data = await listStudentsWithoutParent()
    setAvailableStudents(data)
  }

  useEffect(() => { loadParents() }, [])

  useEffect(() => {
    if (createState?.success) {
      setCreateDialogOpen(false)
      loadParents()
    }
  }, [createState])

  useEffect(() => {
    if (linkState?.success) {
      setLinkDialogOpen(false)
      setSelectedParent(null)
      loadParents()
    }
  }, [linkState])

  const openLinkDialog = async (parent: any) => {
    setSelectedParent(parent)
    await loadAvailableStudents()
    setLinkDialogOpen(true)
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
        <CardHeader>
          <CardTitle>Lista de Padres</CardTitle>
        </CardHeader>
        <CardContent>
          {parents.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay padres registrados.</p>
          ) : (
            <div className="space-y-2">
              {parents.map((parent) => (
                <div key={parent.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{parent.nombre}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{parent.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {parent.estudiantes?.[0]?.count ?? 0} estudiante(s)
                    </span>
                    <Button size="sm" variant="secondary" onClick={() => openLinkDialog(parent)}>
                      Vincular Estudiante
                    </Button>
                    <form action={async (formData) => {
                      formData.set('userId', parent.id)
                      const result = await deleteParent(null, formData)
                      if (result.success) loadParents()
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

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} title="Nuevo Padre">
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
            <Button type="button" variant="ghost" onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear Padre'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={linkDialogOpen}
        onClose={() => { setLinkDialogOpen(false); setSelectedParent(null) }}
        title={`Vincular Estudiante - ${selectedParent?.nombre || ''}`}
      >
        <form action={linkAction} className="space-y-4">
          <input type="hidden" name="parentId" value={selectedParent?.id || ''} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Estudiante</label>
            <Select name="studentId" required>
              <option value="">Seleccionar estudiante</option>
              {availableStudents.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </Select>
          </div>
          {linkState?.error && (
            <p className="text-sm text-red-400">{linkState.error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => { setLinkDialogOpen(false); setSelectedParent(null) }}>Cancelar</Button>
            <Button type="submit" disabled={isLinking}>
              {isLinking ? 'Vinculando...' : 'Vincular'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
