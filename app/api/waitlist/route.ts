import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { email, context } = body as Record<string, unknown>

  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 422 })
  }

  const apiKey = process.env.LOOPS_API_KEY

  if (!apiKey) {
    // TODO: Add your Loops API key to .env.local as LOOPS_API_KEY=your_key_here
    // See README.md for setup instructions.
    console.log('[nothing.ai waitlist] LOOPS_API_KEY not set — logging locally:', {
      email,
      context: typeof context === 'string' ? context.trim() : undefined,
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true })
  }

  try {
    const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        source: 'nothing-ai-waitlist',
        ...(typeof context === 'string' && context.trim()
          ? { screenshotUseCase: context.trim() }
          : {}),
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[nothing.ai waitlist] Loops error:', res.status, text)
      // Return ok anyway — don't block the user on a Loops API failure
    }
  } catch (err) {
    console.error('[nothing.ai waitlist] Loops fetch failed:', err)
    // Same — return ok to the client
  }

  return NextResponse.json({ ok: true })
}
