export type UserRole = 'director' | 'teacher' | 'parent'

export interface Profile {
  id: string
  email: string
  nombre: string
  role: UserRole
  created_at: string
}

export interface Estudiante {
  id: string
  nombre: string
  grado: string
  grupo: string
  parent_id: string | null
  created_at: string
}

export interface Asistencia {
  id: string
  student_id: string
  fecha: string
  estado: 'presente' | 'ausente' | 'tardanza'
  teacher_id: string
  created_at: string
}

export interface NotaDiaria {
  id: string
  student_id: string
  fecha: string
  materia: string
  calificacion: number
  comentario: string | null
  teacher_id: string
  created_at: string
}

export interface Aviso {
  id: string
  titulo: string
  contenido: string
  created_by: string
  target: 'parents' | 'teachers' | 'all'
  created_at: string
}
