import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/auth/callback')) {
    return NextResponse.next()
  }

  const sessionCookie = req.cookies.get('session')?.value
  const session = await decrypt(sessionCookie)

  if (!session && path !== '/login') {
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
    if (session.role === 'teacher' && !path.startsWith('/profesor') && path !== '/login') {
      return NextResponse.redirect(new URL('/profesor', req.nextUrl))
    }
    if (session.role === 'parent' && !path.startsWith('/padres') && path !== '/login') {
      return NextResponse.redirect(new URL('/padres', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
