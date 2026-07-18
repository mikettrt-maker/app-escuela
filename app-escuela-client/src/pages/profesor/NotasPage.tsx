import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { getTeacherAssignments, getStudentsByGrade, saveNota, getNotasByDate, CAMPOS_FORMATIVOS, GRADO_MAP } from '../../lib/data'

export default function ProfesorNotasPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [notas, setNotas] = useState<Record<string, Record<number, string>>>({})
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  useEffect(() => {
    getTeacherAssignments().then(data => {
      setAssignments(data)
      const grades = [...new Set(data.map(a => a.grupo_id))].sort()
      if (grades.length > 0) setSelectedGroup(String(grades[0]))
    })
  }, [])

  useEffect(() => {
    if (!selectedGroup) return
    const grado = GRADO_MAP[parseInt(selectedGroup)] || selectedGroup
    getStudentsByGrade(grado).then(setStudents)
  }, [selectedGroup])

  useEffect(() => {
    if (!selectedGroup) return
    const grado = GRADO_MAP[parseInt(selectedGroup)] || selectedGroup
    getStudentsByGrade(grado).then(setStudents)

    const campos = assignments
      .filter(a => String(a.grupo_id) === selectedGroup)
      .map(a => a.campo_id)

    const loadNotas = async () => {
      const map: Record<string, Record<number, string>> = {}
      for (const campoId of campos) {
        const campo = CAMPOS_FORMATIVOS.find(c => c.id === campoId)
        if (!campo) continue
        const existing = await getNotasByDate(fecha, campo.nombre)
        existing.forEach((n: any) => {
          if (!map[n.student_id]) map[n.student_id] = {}
          map[n.student_id][campoId] = String(n.calificacion)
        })
      }
      setNotas(prev => ({ ...prev, ...map }))
    }
    loadNotas()
  }, [selectedGroup, fecha])

  const camposForGroup = assignments
    .filter(a => String(a.grupo_id) === selectedGroup)
    .map(a => CAMPOS_FORMATIVOS.find(c => c.id === a.campo_id))
    .filter(Boolean)

  const handleSave = async (studentId: string) => {
    setSaving(prev => ({ ...prev, [studentId]: true }))
    for (const campo of camposForGroup) {
      const cal = notas[studentId]?.[campo!.id]
      if (cal) {
        try {
          await saveNota(studentId, fecha, campo!.nombre, parseFloat(cal))
        } catch {}
      }
    }
    setSaving(prev => ({ ...prev, [studentId]: false }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs text-[var(--text-secondary)] mb-1">Fecha</label>
          <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-secondary)] mb-1">Grupo</label>
          <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]">
            {[...new Set(assignments.map(a => a.grupo_id))].sort().map(g => (
              <option key={g} value={g}>{GRADO_MAP[g] || g}°</option>
            ))}
          </select>
        </div>
      </div>

      {camposForGroup.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
          No tienes campos formativos asignados a este grupo.
        </CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Notas del Día - {GRADO_MAP[parseInt(selectedGroup)] || selectedGroup}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 text-[var(--text-secondary)]">Estudiante</th>
                    {camposForGroup.map(c => (
                      <th key={c!.id} className="text-center py-2 px-2 text-[var(--text-secondary)] min-w-[120px]">{c!.nombre.split(' ').slice(0, 2).join(' ')}</th>
                    ))}
                    <th className="text-center py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id} className="border-b border-[var(--border)]">
                      <td className="py-2 px-2 text-[var(--text-primary)]">{student.nombre}</td>
                      {camposForGroup.map(campo => (
                        <td key={campo!.id} className="py-1 px-1">
                          <input type="number" step="0.1" min="0" max="10"
                            value={notas[student.id]?.[campo!.id] || ''}
                            onChange={e => setNotas(prev => ({
                              ...prev,
                              [student.id]: { ...prev[student.id], [campo!.id]: e.target.value }
                            }))}
                            className="w-20 text-center mx-auto rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        </td>
                      ))}
                      <td className="py-2 px-2">
                        <Button size="sm" onClick={() => handleSave(student.id)} disabled={saving[student.id]}>
                          {saving[student.id] ? '...' : 'Guardar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
