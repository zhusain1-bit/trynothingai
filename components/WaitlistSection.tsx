'use client'

import { useState, useId, useEffect } from 'react'
import { capture, getSource, buildDepositUrl } from '@/lib/posthog'
import { WAITLIST_COUNT } from '@/lib/constants'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const STRIPE_URL = process.env.NEXT_PUBLIC_STRIPE_DEPOSIT_URL ?? null

export function WaitlistSection() {
  const emailId   = useId()
  const contextId = useId()

  const [email,      setEmail]      = useState('')
  const [context,    setContext]    = useState('')
  const [formState,  setFormState]  = useState<FormState>('idle')
  const [errMsg,     setErrMsg]     = useState('')
  const [showFollow, setShowFollow] = useState(false)
  const [followSent, setFollowSent] = useState(false)
  const [depositHref, setDepositHref] = useState<string | null>(STRIPE_URL)

  // Fade in the follow-up field 400ms after success
  useEffect(() => {
    if (formState !== 'success') return
    const t = setTimeout(() => setShowFollow(true), 400)
    return () => clearTimeout(t)
  }, [formState])

  // Upgrade the deposit link to the source-attributed URL after mount.
  // Server renders the bare STRIPE_URL; building the attributed URL only client-side
  // avoids a hydration mismatch on the href attribute.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: hydration-safe href upgrade must run once after mount
    if (STRIPE_URL) setDepositHref(buildDepositUrl(STRIPE_URL))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formState === 'loading' || formState === 'success') return
    if (!email.trim()) return

    setFormState('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong')
      setFormState('success')
      capture('waitlist_signup', { source: getSource(), location: 'waitlist_section', has_context: false })
    } catch (err) {
      setFormState('error')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function handleFollowUp(e: React.FormEvent) {
    e.preventDefault()
    if (!context.trim()) { setFollowSent(true); return }
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), context: context.trim(), contextOnly: true }),
      })
    } catch { /* non-critical */ }
    setFollowSent(true)
  }

  const signupCard = formState === 'success' ? (
    <div
      className="surface w-full p-[26px] flex flex-col items-center gap-[10px] text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="rounded-full flex items-center justify-center font-mono"
        style={{ width: 32, height: 32, border: '1.5px solid var(--phosphor)', color: 'var(--phosphor)', boxShadow: '0 0 16px var(--phosphor-glow)', fontSize: 15 }}
      >
        ✓
      </div>
      <p className="font-semibold" style={{ fontSize: 16, color: 'var(--mist)' }}>you&rsquo;re in.</p>
      <p className="font-mono" style={{ fontSize: 11.5, color: 'var(--ghost2)' }}>we&rsquo;ll reach out when founding access opens.</p>

      {/* Follow-up context field */}
      {!followSent && showFollow && (
        <form
          className="w-full mt-[6px] flex flex-col gap-[8px]"
          style={{ opacity: showFollow ? 1 : 0, transition: 'opacity .5s var(--ease)' }}
          onSubmit={handleFollowUp}
        >
          <label htmlFor={contextId} className="font-mono" style={{ fontSize: 11.5, color: 'var(--ghost2)', letterSpacing: '.04em' }}>
            what would you screenshot this for? <span style={{ opacity: .5 }}>(optional)</span>
          </label>
          <input
            id={contextId}
            type="text"
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="concert tickets, receipts, comparing prices…"
            className="rounded-[10px] px-[12px] py-[9px] outline-none"
            style={{ background: 'rgba(0,0,0,.35)', border: '1px solid var(--hairline2)', color: 'var(--mist)', fontSize: 13 }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline2)'; e.currentTarget.style.boxShadow = '' }}
          />
          <div className="flex gap-[8px]">
            <button type="submit" className="btn-phosphor flex-1 justify-center py-[8px]" style={{ fontSize: 12.5 }}>
              send
            </button>
            <button type="button" onClick={() => setFollowSent(true)} style={{ fontSize: 12, color: 'var(--ghost2)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 10px' }}>
              skip
            </button>
          </div>
        </form>
      )}
      {followSent && context && (
        <p className="font-mono" style={{ fontSize: 11.5, color: 'var(--ghost2)', marginTop: 4 }}>got it. thanks.</p>
      )}
    </div>
  ) : (
    <form
      className="surface w-full p-[26px] flex flex-col gap-[14px]"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Waitlist signup"
    >
      <div className="font-semibold" style={{ fontSize: 17, color: 'var(--mist)' }}>join the waitlist</div>
      <p style={{ fontSize: 13.5, color: 'var(--ghost)', lineHeight: 1.5 }}>
        free. we&rsquo;ll email you when founding access opens.
      </p>
      <div className="flex flex-col gap-[5px]">
        <label htmlFor={emailId} className="font-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ghost2)' }}>
          email
        </label>
        <input
          id={emailId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={formState === 'loading'}
          placeholder="you@example.com"
          aria-required="true"
          className="rounded-[10px] px-[12px] py-[9px] outline-none transition-shadow"
          style={{ background: 'rgba(0,0,0,.35)', border: '1px solid var(--hairline2)', color: 'var(--mist)', fontSize: 13.5 }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline2)'; e.currentTarget.style.boxShadow = '' }}
        />
      </div>

      {formState === 'error' && (
        <p className="font-mono" style={{ fontSize: 11, color: '#ff8080' }} role="alert">{errMsg}</p>
      )}

      <button
        type="submit"
        disabled={formState === 'loading' || !email.trim()}
        aria-busy={formState === 'loading'}
        className="btn-phosphor justify-center py-[10px]"
        style={{ fontSize: 13.5, opacity: (formState === 'loading' || !email.trim()) ? 0.45 : 1, cursor: (formState === 'loading' || !email.trim()) ? 'not-allowed' : 'pointer' }}
      >
        {formState === 'loading' ? 'sending…' : 'get founding access'}
      </button>

      <p className="font-mono text-center" style={{ fontSize: 11.5, color: 'var(--ghost2)' }}>
        no charge now · founding users get 50% off at launch
      </p>
    </form>
  )

  return (
    <section
      id="waitlist"
      className="w-full mx-auto px-4 flex flex-col items-center gap-[40px]"
      style={{ maxWidth: STRIPE_URL ? 880 : 520 }}
      aria-labelledby="waitlist-heading"
    >
      <div className="text-center flex flex-col items-center gap-[14px]">
        <span className="eyebrow">founding access</span>
        <h2 id="waitlist-heading" className="headline-l" style={{ color: 'var(--mist)' }}>
          Be first.
        </h2>
        <p className="copy-l" style={{ maxWidth: 460 }}>
          no charge now · founding users get 50% off at launch.
        </p>
        <p className="font-mono" style={{ fontSize: 12, color: 'var(--ghost2)' }}>
          {WAITLIST_COUNT} already on the founding list
        </p>
      </div>

      {/* Two ways to get it — Apple "which one is right for you" layout */}
      <div className={`w-full grid grid-cols-1 gap-[14px] ${STRIPE_URL ? 'md:grid-cols-2' : ''}`}>
        {signupCard}

        {STRIPE_URL && (
          <div className="surface w-full p-[26px] flex flex-col gap-[14px]">
            <div className="font-semibold" style={{ fontSize: 17, color: 'var(--mist)' }}>
              $5 founding access
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ghost)', lineHeight: 1.5 }}>
              lock founding access now. credited toward your launch purchase, locks 50% off, refundable on request.
            </p>
            <a
              href={depositHref ?? STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
              style={{ fontSize: 15, marginTop: 'auto' }}
              onClick={() => { capture('deposit_click', { source: getSource(), location: 'waitlist_section' }); capture('deposit_started', { source: getSource(), location: 'waitlist_section' }) }}
            >
              skip the line
            </a>
            <p className="font-mono" style={{ fontSize: 11.5, color: 'var(--ghost2)' }}>
              goes toward your launch purchase · locks 50% off · refundable on request
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
