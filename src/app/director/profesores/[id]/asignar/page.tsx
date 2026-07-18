'use client'

import { useEffect, useState, useActionState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { saveAssignment, removeAssignment, getAssignments } from '@/lib/actions/admin'
import { GRADOS, CAMPOS_FORMATIVOS, listTeachers } from '@/lib/data'

interface Assignment {
  id: string
  grupo_id: number
  campo_id: number
}

export default function AsignarPage() {
  const params = useParams()
  const teacherId = params.id as string

  const [teacherName, setTeacherName] = useState('')
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [error, setError] = useState('')
  const [grupoId, setGrupoId] = useState('1')
  const [campoId, setCampoId] = useState('1')

  const [saveState, saveAction, isSaving] = useActionState(saveAssignment, null)
  const [removeState, removeAction, isRemoving] = useActionState(removeAssignment, null)

  const loadData = async () => {
    const teachers = await listTeachers()
    const teacher = teachers.find(t => t.id === teacherId)
    if (teacher) setTeacherName(teacher.nombre)

    const result = await getAssignments(teacherId)
    setAssignments(result)
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (saveState?.success) {
      loadData()
    }
    if (saveState?.error) {
      setError(saveState.error)
    }
  }, [saveState])

  useEffect(() => {
    if (removeState?.success) {
      loadData()
    }
  }, [removeState])

  const groupedByCampo: Record<number, Assignment[]> = {}
  assignments.forEach(a => {
    if (!groupedByCampo[a.campo_id]) groupedByCampo[a.campo_id] = []
    groupedByCampo[a.campo_id].push(a)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Asignar Grupos - {teacherName || 'Cargando...'}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">Asigna grupos y campos formativos al profesor</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asignar</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveAction} className="space-y-4">
              <input type="hidden" name="teacherId" value={teacherId} />
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Grupo</label>
                <select
                  name="grupoId"
                  value={grupoId}
                  onChange={e => setGrupoId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {GRADOS.map((grado, i) => (
                    <option key={i + 1} value={i + 1}>{grado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Campo Formativo</label>
                <select
                  name="campoId"
                  value={campoId}
                  onChange={e => setCampoId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {CAMPOS_FORMATIVOS.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Asignar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asignaciones actuales</CardTitle>
          </CardHeader>
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
                        {campo?.nombre || 'Campo ' + campoIdStr}
                        <span className="ml-2 text-xs text-[var(--text-secondary)]">({items.length}/3)</span>
                      </p>
                      <div className="space-y-1">
                        {items.map(a => {
                          const grado = GRADOS[a.grupo_id - 1] || 'Grupo ' + a.grupo_id
                          return (
                            <div key={a.id} className="flex items-center justify-between rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
                              <span className="text-sm text-[var(--text-primary)]">{grado}</span>
                              <form action={removeAction}>
                                <input type="hidden" name="id" value={a.id} />
                                <Button type="submit" size="sm" variant="ghost" disabled={isRemoving}>
                                  ✕
                                </Button>
                              </form>
                            </div>
                          )
                        })}
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
