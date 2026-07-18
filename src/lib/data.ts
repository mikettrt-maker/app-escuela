import { createAdminClient } from '@/lib/supabase/admin'

export const GRADOS = ['1°', '2°', '3°', '4°', '5°', '6°']

export const CAMPOS_FORMATIVOS = [
  { id: 1, nombre: 'Saberes y pensamiento científico' },
  { id: 2, nombre: 'Lenguajes Español' },
  { id: 3, nombre: 'Lenguajes Inglés' },
  { id: 4, nombre: 'Ética, naturaleza y sociedades' },
  { id: 5, nombre: 'De lo humano y lo comunitario' },
]

export async function listTeachers() {
  const admin = createAdminClient()
  const { data } = await admin.from('profiles').select('id, nombre, email').eq('role', 'teacher').order('nombre')
  return data || []
}

export async function listStudents() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('estudiantes')
    .select('*, parent:parent_id(id, nombre, email)')
    .order('nombre')
  return data || []
}

export async function listParents() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('id, nombre, email')
    .eq('role', 'parent')
    .order('nombre')
  return data || []
}
