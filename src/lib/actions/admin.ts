'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function createTeacher(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: userData, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
  if (createError) return { error: createError.message }

  const { error: updateError } = await admin.from('profiles').update({ role: 'teacher', nombre }).eq('id', userData.user.id)
  if (updateError) return { error: updateError.message }

  return { success: true }
}

export async function deleteUser(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const userId = formData.get('userId') as string
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function saveAssignment(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const teacherId = formData.get('teacherId') as string
  const grupoId = parseInt(formData.get('grupoId') as string)
  const campoId = parseInt(formData.get('campoId') as string)

  const { data: existing } = await admin
    .from('asignaciones_profesores')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('campo_id', campoId)

  if (existing && existing.length >= 3) {
    return { error: 'Este profesor ya tiene 3 grupos asignados para este campo formativo (máximo 3)' }
  }

  const { data: dup } = await admin
    .from('asignaciones_profesores')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('grupo_id', grupoId)
    .eq('campo_id', campoId)

  if (dup && dup.length > 0) {
    return { error: 'Esta asignación ya existe' }
  }

  const { error } = await admin.from('asignaciones_profesores').insert({
    teacher_id: teacherId,
    grupo_id: grupoId,
    campo_id: campoId,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function removeAssignment(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const id = formData.get('id') as string
  const { error } = await admin.from('asignaciones_profesores').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function getAssignments(teacherId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('asignaciones_profesores')
    .select('id, grupo_id, campo_id')
    .eq('teacher_id', teacherId)
  return data || []
}

export async function createStudent(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const nombre = formData.get('nombre') as string
  const grado = formData.get('grado') as string

  const { error } = await admin.from('estudiantes').insert({ nombre, grado, grupo: '' })
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteStudent(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const id = formData.get('id') as string
  const { error } = await admin.from('estudiantes').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function createParent(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: userData, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
  if (createError) return { error: createError.message }

  const { error: updateError } = await admin.from('profiles').update({ role: 'parent', nombre }).eq('id', userData.user.id)
  if (updateError) return { error: updateError.message }

  return { success: true, userId: userData.user.id }
}

export async function deleteParent(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const userId = formData.get('userId') as string
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function linkStudentToParent(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const studentId = formData.get('studentId') as string
  const parentId = formData.get('parentId') as string

  const { error } = await admin.from('estudiantes').update({ parent_id: parentId }).eq('id', studentId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function listAvisos() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('avisos')
    .select('*, author:created_by(nombre)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function createAviso(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const titulo = formData.get('titulo') as string
  const contenido = formData.get('contenido') as string
  const target = formData.get('target') as string
  const userId = formData.get('userId') as string

  const { error } = await admin.from('avisos').insert({
    titulo,
    contenido,
    target,
    created_by: userId,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteAviso(prevState: unknown, formData: FormData) {
  const admin = createAdminClient()
  const id = formData.get('id') as string
  const { error } = await admin.from('avisos').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function listStudents() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('estudiantes')
    .select('*, parent:parent_id(nombre, email)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function listParents() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('*, estudiantes:estudiantes!left(count)')
    .eq('role', 'parent')
    .order('created_at', { ascending: false })
  return data || []
}

export async function listStudentsWithoutParent() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('estudiantes')
    .select('id, nombre')
    .is('parent_id', null)
    .order('nombre')
  return data || []
}

export async function getCurrentUserId() {
  const { cookies } = await import('next/headers')
  const { decrypt } = await import('@/lib/session')
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  const session = await decrypt(sessionCookie)
  return session?.userId || null
}

export async function listNotas(fecha?: string) {
  const admin = createAdminClient()
  let query = admin
    .from('notas_diarias')
    .select('*, student:student_id(nombre)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (fecha) query = query.eq('fecha', fecha)
  const { data } = await query
  return data || []
}

export async function listAsistencias(fecha?: string) {
  const admin = createAdminClient()
  let query = admin
    .from('asistencias')
    .select('*, student:student_id(nombre)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (fecha) query = query.eq('fecha', fecha)
  const { data } = await query
  return data || []
}
