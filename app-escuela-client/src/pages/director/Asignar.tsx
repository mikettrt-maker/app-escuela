import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { GRADOS, CAMPOS_FORMATIVOS, listTeachers, getAssignments, saveAssignment, removeAssignment } from '../../lib/data'

interface Assignment { id: string; grupo_id: number; campo_id: number }

export default function AsignarPage() {
  const { id: teacherId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [teacherName, setTeacherName] = useState('')
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [error, setError] = useState('')
  const [grupoId, setGrupoId] = useState('1')
  const [campoId, setCampoId] = useState('1')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!teacherId) return
    const teachers = await listTeachers()
    const t = teachers.find(t => t.id === teacherId)
    if (t) setTeacherName(t.nombre)
    setAssignments(await getAssignments(teacherId))
  }

  useEffect(() => { load() }, [teacherId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacherId) return
    setError('')
    setLoading(true)
    try {
      await saveAssignment(teacherId, parseInt(grupoId), parseInt(campoId))
      load()
    } catch (err: any) { setError(err.message) }
    setLoading(false)
  }

  const handleRemove = async (id: string) => {
    await removeAssignment(id)
    load()
  }

  const groupedByCampo: Record<number, Assignment[]> = {}
  assignments.forEach(a => {
    if (!groupedByCampo[a.campo_id]) groupedByCampo[a.campo_id] = []
    groupedByCampo[a.campo_id].push(a)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/director/profesores')} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">&larr; Volver</button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Asignar Grupos - {teacherName || 'Cargando...'}</h1>
        <p className="text-sm text-[var(--text-secondary)]">Asigna grupos y campos formativos al profesor</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Asignar</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Grupo</label>
                <select value={grupoId} onChange={e => setGrupoId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  {GRADOS.map((grado, i) => (<option key={i + 1} value={i + 1}>{grado}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Campo Formativo</label>
                <select value={campoId} onChange={e => setCampoId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  {CAMPOS_FORMATIVOS.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                </select>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Asignar'}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Asignaciones actuales</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--text-secondary)] mb-4">Máximo 3 grupos por campo formativo</p>
            {assignments.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">Sin asignaciones.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedByCampo).map(([campoIdStr, items]) => {
                  const campo = CAMPOS_FORMATIVOS.find(c => c.id === parseInt(campoIdStr))
                  return (
                    <div key={campoIdStr}>
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                        {campo?.nombre} <span className="ml-2 text-xs text-[var(--text-secondary)]">({items.length}/3)</span>
                      </p>
                      <div className="space-y-1">
                        {items.map(a => (
                          <div key={a.id} className="flex items-center justify-between rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
                            <span className="text-sm text-[var(--text-primary)]">{GRADOS[a.grupo_id - 1]}</span>
                            <button onClick={() => handleRemove(a.id)} className="text-xs text-[var(--text-secondary)] hover:text-red-400">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
