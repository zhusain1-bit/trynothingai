import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const WELCOME_HTML = (email: string) => `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0B0D;font-family:system-ui,sans-serif;color:#E9EBEF">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0B0D;padding:48px 24px">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;border:1px solid rgba(255,255,255,0.10);border-radius:18px;background:linear-gradient(180deg,rgba(22,24,30,.9),rgba(13,14,19,.95));padding:40px 36px">
        <tr><td>
          <p style="margin:0 0 32px;font-size:12px;letter-spacing:.28em;color:#878C96;text-transform:lowercase">
            &mdash; <span style="color:#E9EBEF">nothing</span><span style="color:#AEC2FF">.ai</span> &mdash;
          </p>
          <h1 style="margin:0 0 16px;font-size:28px;font-weight:600;letter-spacing:-.02em;line-height:1.2;color:#E9EBEF">
            you&rsquo;re on the list.
          </h1>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#878C96">
            founding access is open to a small group first. we&rsquo;ll reach out when it&rsquo;s your turn &mdash; no spam, just the one email that matters.
          </p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#878C96">
            founding users get <span style="color:#E9EBEF;font-weight:500">50% off</span> at launch, locked in permanently.
          </p>
          <div style="height:1px;background:rgba(255,255,255,.08);margin:0 0 28px"></div>
          <p style="margin:0;font-size:11px;color:#5A5F69;letter-spacing:.04em;line-height:1.7">
            the ai without a face.<br>
            <a href="https://trynothingai.com" style="color:#AEC2FF;text-decoration:none">trynothingai.com</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:10px;color:#5A5F69;text-align:center">
        you signed up at trynothingai.com &middot; ${email}
      </p>
    </td></tr>
  </table>
</body>
</html>`

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

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[nothing.ai waitlist] RESEND_API_KEY not set:', {
      email,
      context: typeof context === 'string' ? context.trim() : undefined,
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true })
  }

  const resend = new Resend(apiKey)
  const contextStr = typeof context === 'string' && context.trim() ? context.trim() : null

  // Welcome email to signup
  const { error: welcomeErr } = await resend.emails.send({
    from: 'nothing.ai <zohair@trynothingai.com>',
    to: [email],
    subject: "you're on the list.",
    html: WELCOME_HTML(email),
  })
  if (welcomeErr) console.error('[nothing.ai waitlist] welcome email error:', welcomeErr)

  // Notification to owner
  const { error: notifyErr } = await resend.emails.send({
    from: 'nothing.ai waitlist <zohair@trynothingai.com>',
    to: ['zohairhusain14@gmail.com'],
    subject: `new signup: ${email}`,
    text: [`Email: ${email}`, contextStr ? `Context: ${contextStr}` : null, `Time: ${new Date().toISOString()}`].filter(Boolean).join('\n'),
  })
  if (notifyErr) console.error('[nothing.ai waitlist] notify email error:', notifyErr)

  return NextResponse.json({ ok: true })
}
