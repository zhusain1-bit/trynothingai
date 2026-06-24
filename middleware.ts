import { NextRequest, NextResponse } from 'next/server'

// Clean vanity paths → set traffic_source cookie → redirect to /
// Bio link reads trynothingai.com/tiktok; visitor lands on clean trynothingai.com
const SOURCES: Record<string, string> = {
  '/x':        'x',
  '/tiktok':   'tiktok',
  '/ig':       'instagram',
  '/linkedin': 'linkedin',
  '/yt':       'youtube',
}

export function middleware(req: NextRequest) {
  const source = SOURCES[req.nextUrl.pathname]
  if (!source) return NextResponse.next()

  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('traffic_source', source, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
    sameSite: 'lax',
    httpOnly: false, // must be readable by client JS for analytics
  })
  return res
}

export const config = {
  matcher: ['/x', '/tiktok', '/ig', '/linkedin', '/yt'],
}
