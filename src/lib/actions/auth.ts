'use server'

import { createClient } from '@/lib/supabase/server'
import { createSession, deleteSession, getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function loginWithEmail(prevState: { error: string } | undefined, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (profile) {
    await createSession(profile.id, profile.role)
  }

  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  await deleteSession()
  redirect('/login')
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
