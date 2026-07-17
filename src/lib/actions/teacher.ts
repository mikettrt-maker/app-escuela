'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'

export async function getTeacherAssignments() {
  const session = await getSession()
  if (!session) return []

  const admin = createAdminClient()
  const { data } = await admin
    .from('asignaciones_profesores')
    .select('grupo_id, campo_id')
    .eq('teacher_id', session.userId)
  return data || []
}

export async function getStudentsByGrade(grado: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('estudiantes')
    .select('id, nombre')
    .eq('grado', grado)
    .order('nombre')
  return data || []
}

export async function saveNota(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const studentId = formData.get('studentId') as string
  const fecha = formData.get('fecha') as string
  const materia = formData.get('materia') as string
  const calificacion = parseFloat(formData.get('calificacion') as string)
  const comentario = formData.get('comentario') as string || null

  const { data: existing } = await admin
    .from('notas_diarias')
    .select('id')
    .eq('student_id', studentId)
    .eq('fecha', fecha)
    .eq('materia', materia)
    .single()

  if (existing) {
    const { error } = await admin
      .from('notas_diarias')
      .update({ calificacion, comentario })
      .eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await admin
      .from('notas_diarias')
      .insert({ student_id: studentId, fecha, materia, calificacion, comentario })
    if (error) return { error: error.message }
  }

  return { success: true }
}

export async function getNotasByDate(fecha: string, materia: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('notas_diarias')
    .select('*, student:student_id(nombre)')
    .eq('fecha', fecha)
    .eq('materia', materia)
  return data || []
}

export async function saveAsistencia(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const studentId = formData.get('studentId') as string
  const fecha = formData.get('fecha') as string
  const estado = formData.get('estado') as string
  const session = await getSession()
  if (!session) return { error: 'No autenticado' }

  const { data: existing } = await admin
    .from('asistencias')
    .select('id')
    .eq('student_id', studentId)
    .eq('fecha', fecha)
    .single()

  if (existing) {
    const { error } = await admin
      .from('asistencias')
      .update({ estado, teacher_id: session.userId })
      .eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await admin
      .from('asistencias')
      .insert({ student_id: studentId, fecha, estado, teacher_id: session.userId })
    if (error) return { error: error.message }
  }

  return { success: true }
}

export async function getAsistenciasByDate(fecha: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('asistencias')
    .select('*, student:student_id(nombre)')
    .eq('fecha', fecha)
  return data || []
}
