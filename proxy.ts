import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const publicRoutes = ['/login', '/auth/callback']
const directorRoutes = ['/director']
const teacherRoutes = ['/profesor']
const parentRoutes = ['/padres']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/auth/callback')) {
    return NextResponse.next()
  }

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (session && path === '/login') {
    const roleRedirect = session.role === 'director' ? '/director' : session.role === 'teacher' ? '/profesor' : '/padres'
    return NextResponse.redirect(new URL(roleRedirect, req.nextUrl))
  }

  if (session) {
    if (session.role === 'director' && !path.startsWith('/director')) {
      return NextResponse.redirect(new URL('/director', req.nextUrl))
    }
    if (session.role === 'teacher' && !path.startsWith('/profesor') && !publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/profesor', req.nextUrl))
    }
    if (session.role === 'parent' && !path.startsWith('/padres') && !publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/padres', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
