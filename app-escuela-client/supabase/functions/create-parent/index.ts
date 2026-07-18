import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.6'

serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { nombre, email, password } = await req.json()

    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
    })
    if (createError) throw createError

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'parent', nombre })
      .eq('id', userData.user.id)
    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true, userId: userData.user.id }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
})
