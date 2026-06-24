'use client'

import { useState, useId, useEffect } from 'react'
import { capture, getSource, buildDepositUrl } from '@/lib/posthog'

const WAITLIST_COUNT = 127
const STRIPE_URL = process.env.NEXT_PUBLIC_STRIPE_DEPOSIT_URL ?? null

type State = 'idle' | 'loading' | 'success' | 'error'

export function HeroWaitlistInline() {
  const emailId    = useId()
  const contextId  = useId()
  const [email,      setEmail]      = useState('')
  const [context,    setContext]    = useState('')
  const [state,      setState]      = useState<State>('idle')
  const [showFollow, setShowFollow] = useState(false)
  const [followSent, setFollowSent] = useState(false)
  const [depositHref, setDepositHref] = useState<string | null>(STRIPE_URL)

  useEffect(() => {
    if (state !== 'success') return
    const t = setTimeout(() => setShowFollow(true), 400)
    return () => clearTimeout(t)
  }, [state])

  // Upgrade the deposit link to the source-attributed URL after mount.
  // Server renders the bare STRIPE_URL; building the attributed URL only client-side
  // avoids a hydration mismatch on the href attribute.
  useEffect(() => {
    if (STRIPE_URL) setDepositHref(buildDepositUrl(STRIPE_URL))
  }, [])

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
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong')
      setState('success')
      capture('waitlist_signup', { source: getSource(), location: 'hero', has_context: false })
    } catch {
      setState('error')
    }
  }

  async function handleFollowUp(e: React.FormEvent) {
    e.preventDefault()
    if (context.trim()) {
      capture('waitlist_signup', { source: getSource(), location: 'hero', has_context: true })
      try {
        await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), context: context.trim(), contextOnly: true }),
        })
      } catch { /* non-critical */ }
    }
    setFollowSent(true)
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col gap-[10px] w-full" style={{ maxWidth: 420 }}>
        <div className="flex items-center gap-[8px] font-mono" style={{ fontSize: 13, color: 'var(--phosphor)' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--phosphor)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, boxShadow: '0 0 10px var(--phosphor-glow)' }}>✓</span>
          you're on the list.
        </div>
        {!followSent && showFollow && (
          <form className="flex flex-col gap-[7px]" onSubmit={handleFollowUp} style={{ opacity: showFollow ? 1 : 0, transition: 'opacity .5s var(--ease)' }}>
            <label htmlFor={contextId} className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)' }}>
              what would you screenshot this for? <span style={{ opacity: .5 }}>(optional)</span>
            </label>
            <input
              id={contextId}
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="concerts, receipts, finding the cheapest option…"
              className="rounded-[10px] px-[12px] py-[8px] outline-none"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--hairline2)', color: 'var(--mist)', fontSize: 13 }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline2)'; e.currentTarget.style.boxShadow = '' }}
            />
            <div className="flex gap-[8px]">
              <button type="submit" className="btn-phosphor" style={{ fontSize: 12, padding: '7px 14px' }}>send</button>
              <button type="button" onClick={() => setFollowSent(true)} style={{ fontSize: 12, color: 'var(--ghost2)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '7px 10px' }}>skip</button>
            </div>
          </form>
        )}
        {followSent && <p className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)' }}>we'll reach out when founding access opens.</p>}
        {STRIPE_URL && (
          <div style={{ marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--hairline)' }}>
            <a
              href={depositHref ?? STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { capture('deposit_click', { source: getSource(), location: 'hero_success' }); capture('deposit_started', { source: getSource(), location: 'hero_success' }) }}
              className="font-mono"
              style={{ fontSize: 11, color: 'var(--ghost2)', textDecoration: 'underline', cursor: 'pointer', textUnderlineOffset: 3 }}
            >
              or lock founding access now — $5, credited at launch
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[8px] w-full" style={{ maxWidth: 420 }}>
      <label htmlFor={emailId} className="font-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ghost2)' }}>
        email
      </label>
      <form className="flex gap-[8px] w-full" onSubmit={handleSubmit} noValidate>
        <input
          id={emailId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={state === 'loading'}
          placeholder="your@email.com"
          className="flex-1 rounded-[11px] px-[13px] py-[10px] outline-none transition-shadow"
          style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--hairline2)', color: 'var(--mist)', fontSize: 13.5, cursor: 'text' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline2)'; e.currentTarget.style.boxShadow = '' }}
        />
        <button
          type="submit"
          disabled={state === 'loading' || !email.trim()}
          aria-busy={state === 'loading'}
          className="btn-phosphor flex-shrink-0"
          style={{ fontSize: 13, opacity: (state === 'loading' || !email.trim()) ? 0.5 : 1, cursor: (state === 'loading' || !email.trim()) ? 'not-allowed' : 'pointer', minHeight: 44 }}
        >
          {state === 'loading' ? 'sending…' : 'Get founding access'}
        </button>
      </form>

      {/* Social proof + microcopy */}
      <div className="flex items-center justify-between flex-wrap gap-[6px]">
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)' }}>
          no charge now · 50% off at launch
        </p>
        <div className="flex items-center gap-[5px] font-mono" style={{ fontSize: 11, color: 'var(--ghost2)' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 6px var(--phosphor-glow)', display: 'inline-block', animation: 'breathe 3s var(--ease) infinite' }} />
          {WAITLIST_COUNT} on the founding list
        </div>
      </div>

      {/* Deposit option — only shown when Stripe URL is configured */}
      {STRIPE_URL && (
        <div className="text-center" style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid var(--hairline)' }}>
          <a
            href={depositHref ?? STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { capture('deposit_click', { source: getSource(), location: 'hero' }); capture('deposit_started', { source: getSource(), location: 'hero' }) }}
            className="font-mono"
            style={{ fontSize: 11, color: 'var(--ghost2)', textDecoration: 'underline', cursor: 'pointer', textUnderlineOffset: 3 }}
          >
            skip the line — lock founding access for $5
          </a>
          <p className="font-mono" style={{ fontSize: 10, color: 'var(--ghost2)', opacity: 0.65, marginTop: 3 }}>
            goes toward your launch purchase · locks 50% off · refundable on request
          </p>
        </div>
      )}
    </div>
  )
}
