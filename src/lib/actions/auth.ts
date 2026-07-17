'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createSession, deleteSession, getSession } from '@/lib/session'

export async function login(prevState: { error?: string; success?: boolean; redirect?: string } | undefined, formData: FormData) {
  const supabase = await createClient()
  const admin = createAdminClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (!profile) return { error: 'Perfil no encontrado' }

  await createSession(profile.id, profile.role, profile.nombre || '', profile.email)

  const redirectTo = profile.role === 'director' ? '/director' : profile.role === 'teacher' ? '/profesor' : '/padres'
  return { success: true, redirect: redirectTo }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  await deleteSession()
  return { success: true, redirect: '/login' }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.userId)
    .single()

  return profile
}
