export const GRADOS = ['1°', '2°', '3°', '4°', '5°', '6°']

export const CAMPOS_FORMATIVOS = [
  { id: 1, nombre: 'Saberes y pensamiento científico' },
  { id: 2, nombre: 'Lenguajes Español' },
  { id: 3, nombre: 'Lenguajes Inglés' },
  { id: 4, nombre: 'Ética, naturaleza y sociedades' },
  { id: 5, nombre: 'De lo humano y lo comunitario' },
]

export const GRADO_MAP: Record<number, string> = {
  1: '1°', 2: '2°', 3: '3°', 4: '4°', 5: '5°', 6: '6°',
}

const EDGE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_EDGE_URL || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

async function callEdgeFunction(name: string, body: Record<string, unknown>) {
  const { supabase } = await import('./supabase')
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${EDGE_FUNCTIONS_URL}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Error en la operación')
  return result
}

export async function createTeacherUser(nombre: string, email: string, password: string) {
  return callEdgeFunction('create-teacher', { nombre, email, password })
}

export async function createParentUser(nombre: string, email: string, password: string) {
  return callEdgeFunction('create-parent', { nombre, email, password })
}

export async function deleteUser(userId: string) {
  return callEdgeFunction('delete-user', { userId })
}

export async function linkStudent(studentId: string, parentId: string) {
  const { supabase } = await import('./supabase')
  const { error } = await supabase
    .from('estudiantes')
    .update({ parent_id: parentId })
    .eq('id', studentId)
  if (error) throw error
}

export async function listTeachers() {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('profiles')
    .select('id, nombre, email')
    .eq('role', 'teacher')
    .order('nombre')
  return data || []
}

export async function listStudents() {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('estudiantes')
    .select('*, parent:parent_id(id, nombre, email)')
    .order('nombre')
  return data || []
}

export async function listStudentsWithoutParent() {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('estudiantes')
    .select('id, nombre')
    .is('parent_id', null)
    .order('nombre')
  return data || []
}

export async function listParents() {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('profiles')
    .select('id, nombre, email')
    .eq('role', 'parent')
    .order('nombre')
  return data || []
}

export async function createStudent(nombre: string, grado: string) {
  const { supabase } = await import('./supabase')
  const { error } = await supabase.from('estudiantes').insert({ nombre, grado, grupo: '' })
  if (error) throw error
}

export async function deleteStudent(id: string) {
  const { supabase } = await import('./supabase')
  const { error } = await supabase.from('estudiantes').delete().eq('id', id)
  if (error) throw error
}

export async function listAvisos() {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('avisos')
    .select('*, author:created_by(nombre)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function createAviso(titulo: string, contenido: string, target: string, userId: string) {
  const { supabase } = await import('./supabase')
  const { error } = await supabase.from('avisos').insert({
    titulo, contenido, target, created_by: userId,
  })
  if (error) throw error
}

export async function deleteAviso(id: string) {
  const { supabase } = await import('./supabase')
  const { error } = await supabase.from('avisos').delete().eq('id', id)
  if (error) throw error
}

export async function listNotas(fecha?: string) {
  const { supabase } = await import('./supabase')
  let query = supabase
    .from('notas_diarias')
    .select('*, student:student_id(nombre)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (fecha) query = query.eq('fecha', fecha)
  const { data } = await query
  return data || []
}

export async function listAsistencias(fecha?: string) {
  const { supabase } = await import('./supabase')
  let query = supabase
    .from('asistencias')
    .select('*, student:student_id(nombre)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (fecha) query = query.eq('fecha', fecha)
  const { data } = await query
  return data || []
}

export async function getAssignments(teacherId: string) {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('asignaciones_profesores')
    .select('id, grupo_id, campo_id')
    .eq('teacher_id', teacherId)
  return data || []
}

export async function saveAssignment(teacherId: string, grupoId: number, campoId: number) {
  const { supabase } = await import('./supabase')

  const { data: existing } = await supabase
    .from('asignaciones_profesores')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('campo_id', campoId)

  if (existing && existing.length >= 3) {
    throw new Error('Este profesor ya tiene 3 grupos asignados para este campo formativo')
  }

  const { data: dup } = await supabase
    .from('asignaciones_profesores')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('grupo_id', grupoId)
    .eq('campo_id', campoId)

  if (dup && dup.length > 0) {
    throw new Error('Esta asignación ya existe')
  }

  const { error } = await supabase.from('asignaciones_profesores').insert({
    teacher_id: teacherId, grupo_id: grupoId, campo_id: campoId,
  })
  if (error) throw error
}

export async function removeAssignment(id: string) {
  const { supabase } = await import('./supabase')
  const { error } = await supabase.from('asignaciones_profesores').delete().eq('id', id)
  if (error) throw error
}

export async function getTeacherAssignments() {
  const { supabase } = await import('./supabase')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('asignaciones_profesores')
    .select('grupo_id, campo_id')
    .eq('teacher_id', user.id)
  return data || []
}

export async function getStudentsByGrade(grado: string) {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('estudiantes')
    .select('id, nombre')
    .eq('grado', grado)
    .order('nombre')
  return data || []
}

export async function saveNota(studentId: string, fecha: string, materia: string, calificacion: number, comentario?: string) {
  const { supabase } = await import('./supabase')

  const { data: existing } = await supabase
    .from('notas_diarias')
    .select('id')
    .eq('student_id', studentId)
    .eq('fecha', fecha)
    .eq('materia', materia)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('notas_diarias')
      .update({ calificacion, comentario: comentario || null })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('notas_diarias')
      .insert({ student_id: studentId, fecha, materia, calificacion, comentario: comentario || null })
    if (error) throw error
  }
}

export async function getNotasByDate(fecha: string, materia: string) {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('notas_diarias')
    .select('*, student:student_id(nombre)')
    .eq('fecha', fecha)
    .eq('materia', materia)
  return data || []
}

export async function saveAsistencia(studentId: string, fecha: string, estado: string) {
  const { supabase } = await import('./supabase')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data: existing } = await supabase
    .from('asistencias')
    .select('id')
    .eq('student_id', studentId)
    .eq('fecha', fecha)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('asistencias')
      .update({ estado, teacher_id: user.id })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('asistencias')
      .insert({ student_id: studentId, fecha, estado, teacher_id: user.id })
    if (error) throw error
  }
}

export async function getAsistenciasByDate(fecha: string) {
  const { supabase } = await import('./supabase')
  const { data } = await supabase
    .from('asistencias')
    .select('*, student:student_id(nombre)')
    .eq('fecha', fecha)
  return data || []
}
