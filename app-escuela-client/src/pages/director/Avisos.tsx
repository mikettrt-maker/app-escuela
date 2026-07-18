import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Dialog } from '../../components/ui/Dialog'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { supabase } from '../../lib/supabase'
import { listAvisos, createAviso, deleteAviso } from '../../lib/data'

export default function AvisosPage() {
  const [avisos, setAvisos] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const load = async () => setAvisos(await listAvisos())

  useEffect(() => {
    load()
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userId) return
    setError('')
    setCreating(true)
    const fd = new FormData(e.currentTarget)
    try {
      await createAviso(fd.get('titulo') as string, fd.get('contenido') as string, fd.get('target') as string, userId)
      setDialogOpen(false)
      load()
    } catch (err: any) { setError(err.message) }
    setCreating(false)
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
        <CardHeader><CardTitle>Avisos Publicados</CardTitle></CardHeader>
        <CardContent>
          {avisos.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No hay avisos publicados.</p>
          ) : (
            <div className="space-y-3">
              {avisos.map(a => (
                <div key={a.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">{a.titulo}</h4>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{a.contenido}</p>
                      <div className="mt-2 flex gap-3 text-xs text-[var(--text-secondary)]">
                        <span>Por: {a.author?.nombre || 'Desconocido'}</span>
                        <span>Para: {a.target === 'all' ? 'Todos' : a.target === 'parents' ? 'Padres' : 'Profesores'}</span>
                        <span>{new Date(a.created_at).toLocaleDateString('es-MX')}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="danger" onClick={async () => { await deleteAviso(a.id); load() }}>Eliminar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo Aviso">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Título</label>
            <Input name="titulo" required placeholder="Título del aviso" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Contenido</label>
            <textarea name="contenido" required placeholder="Escribe el contenido..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[100px] resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Dirigido a</label>
            <Select name="target" required>
              <option value="all">Todos</option>
              <option value="parents">Padres</option>
              <option value="teachers">Profesores</option>
            </Select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Publicando...' : 'Publicar Aviso'}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
