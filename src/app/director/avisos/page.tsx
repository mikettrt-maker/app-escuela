'use client'

import { useEffect, useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createAviso, deleteAviso, listAvisos, getCurrentUserId } from '@/lib/actions/admin'

export default function AvisosPage() {
  const [avisos, setAvisos] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [createState, createAction, isCreating] = useActionState(createAviso, null)

  const loadAvisos = async () => {
    const data = await listAvisos()
    setAvisos(data)
  }

  useEffect(() => {
    loadAvisos()
    getCurrentUserId().then(setUserId)
  }, [])

  useEffect(() => {
    if (createState?.success) {
      setDialogOpen(false)
      loadAvisos()
    }
  }, [createState])

  const handleCreate = async (formData: FormData) => {
    if (userId) formData.set('userId', userId)
    createAction(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Avisos</h1>
          <p className="text-sm text-[var(--text-secondary)]">Publica avisos para padres y profesores</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>+ Nuevo Aviso</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Avisos Publicados</CardTitle>
        </CardHeader>
        <CardContent>
          {avisos.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay avisos publicados.</p>
          ) : (
            <div className="space-y-3">
              {avisos.map((aviso) => (
                <div key={aviso.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">{aviso.titulo}</h4>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{aviso.contenido}</p>
                      <div className="mt-2 flex gap-3 text-xs text-[var(--text-secondary)]">
                        <span>Por: {aviso.author?.nombre || 'Desconocido'}</span>
                        <span>Para: {aviso.target === 'all' ? 'Todos' : aviso.target === 'parents' ? 'Padres' : 'Profesores'}</span>
                        <span>{new Date(aviso.created_at).toLocaleDateString('es-MX')}</span>
                      </div>
                    </div>
                    <form action={async (formData) => {
                      formData.set('id', aviso.id)
                      const result = await deleteAviso(null, formData)
                      if (result.success) loadAvisos()
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo Aviso">
        <form action={handleCreate} className="space-y-4">
          <input type="hidden" name="userId" value={userId || ''} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Título</label>
            <Input name="titulo" required placeholder="Título del aviso" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Contenido</label>
            <textarea
              name="contenido"
              required
              placeholder="Escribe el contenido del aviso..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[100px] resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Dirigido a</label>
            <Select name="target" required>
              <option value="all">Todos</option>
              <option value="parents">Padres</option>
              <option value="teachers">Profesores</option>
            </Select>
          </div>
          {createState?.error && (
            <p className="text-sm text-red-400">{createState.error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Publicando...' : 'Publicar Aviso'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
