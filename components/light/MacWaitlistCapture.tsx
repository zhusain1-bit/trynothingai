'use client'

import { useId, useState } from 'react'
import { capture, getSource } from '@/lib/posthog'

// The waitlist is NOT deprecated — its 127 real Resend Audience contacts are
// the launch list. This is its new, secondary home (design spec §7): the
// homepage's primary CTA is Download; this is for macOS-only visitors.
export function MacWaitlistCapture() {
  const emailId = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'loading' || state === 'success' || !email.trim()) return
    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = (await res.json()) as { ok?: boolean }
      if (!res.ok || !data.ok) throw new Error('request failed')
      setState('success')
      capture('waitlist_signup', { source: getSource(), location: 'download_mac_waitlist' })
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return <p style={{ fontSize: 14, color: '#6B6B6B' }}>you&rsquo;re on the list — we&rsquo;ll email you when macOS ships.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2" style={{ maxWidth: 380, margin: '0 auto' }} aria-label="macOS waitlist">
      <label htmlFor={emailId} className="sr-only">Email</label>
      <input
        id={emailId}
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={state === 'loading'}
        style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E0D8', background: '#FAF8F5', color: '#1A1A1A', fontSize: 14 }}
      />
      <button type="submit" disabled={state === 'loading'} className="btn-warm" style={{ padding: '10px 18px', fontSize: 13 }}>
        {state === 'loading' ? 'sending…' : 'notify me'}
      </button>
      {state === 'error' && <p role="alert" style={{ fontSize: 12, color: '#B3261E' }}>something went wrong — try again.</p>}
    </form>
  )
}
