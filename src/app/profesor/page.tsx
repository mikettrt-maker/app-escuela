'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getTeacherAssignments, getStudentsByGrade, saveNota, getNotasByDate } from '@/lib/actions/teacher'

const CAMPOS = [
  { id: 1, nombre: 'Saberes y pensamiento científico' },
  { id: 2, nombre: 'Lenguajes Español' },
  { id: 3, nombre: 'Lenguajes Inglés' },
  { id: 4, nombre: 'Ética, naturaleza y sociedades' },
  { id: 5, nombre: 'De lo humano y lo comunitario' },
]

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
    const gradoMap: Record<number, string> = { 1: '1°', 2: '2°', 3: '3°', 4: '4°', 5: '5°', 6: '6°' }
    const grado = gradoMap[parseInt(selectedGroup)] || selectedGroup

    getStudentsByGrade(grado).then(setStudents)

    getNotasByDate(fecha, '').then(existing => {
      const map: Record<string, Record<number, string>> = {}
      existing.forEach((n: any) => {
        const campo = CAMPOS.findIndex(c => c.nombre === n.materia) + 1
        if (campo > 0) {
          if (!map[n.student_id]) map[n.student_id] = {}
          map[n.student_id][campo] = String(n.calificacion)
        }
      })
      setNotas(prev => ({ ...prev, ...map }))
    })
  }, [selectedGroup, fecha])

  const camposForGroup = assignments
    .filter(a => String(a.grupo_id) === selectedGroup)
    .map(a => CAMPOS.find(c => c.id === a.campo_id))
    .filter(Boolean)

  const handleSave = async (studentId: string) => {
    setSaving(prev => ({ ...prev, [studentId]: true }))
    for (const campo of camposForGroup) {
      const cal = notas[studentId]?.[campo!.id]
      if (cal) {
        const formData = new FormData()
        formData.set('studentId', studentId)
        formData.set('fecha', fecha)
        formData.set('materia', campo!.nombre)
        formData.set('calificacion', cal)
        formData.set('comentario', '')
        await saveNota(null, formData)
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
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
          >
            {[...new Set(assignments.map(a => a.grupo_id))].sort().map(g => (
              <option key={g} value={g}>{g}°</option>
            ))}
          </select>
        </div>
      </div>

      {camposForGroup.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
            No tienes campos formativos asignados a este grupo.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Notas del Día - {selectedGroup}°</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 text-[var(--text-secondary)]">Estudiante</th>
                    {camposForGroup.map(c => (
                      <th key={c!.id} className="text-center py-2 px-2 text-[var(--text-secondary)] min-w-[120px]">{c!.nombre}</th>
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
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={notas[student.id]?.[campo!.id] || ''}
                            onChange={e => setNotas(prev => ({
                              ...prev,
                              [student.id]: { ...prev[student.id], [campo!.id]: e.target.value }
                            }))}
                            className="w-20 text-center mx-auto"
                          />
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
