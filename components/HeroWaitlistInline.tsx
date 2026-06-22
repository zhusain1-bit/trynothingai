'use client'

import { useState, useId } from 'react'

// Update this number as the waitlist grows
const WAITLIST_COUNT = 127

type State = 'idle' | 'loading' | 'success' | 'error'

export function HeroWaitlistInline() {
  const emailId = useId()
  const [email, setEmail]   = useState('')
  const [state, setState]   = useState<State>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'loading' || state === 'success' || !email.trim()) return
    setState('loading')
    setErrMsg('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong')
      setState('success')
    } catch (err) {
      setState('error')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center gap-[8px] text-center" style={{ maxWidth: 420 }}>
        <div className="flex items-center gap-[8px] font-mono" style={{ fontSize: 13, color: 'var(--phosphor)' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--phosphor)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, boxShadow: '0 0 10px var(--phosphor-glow)' }}>✓</span>
          you're on the list.
        </div>
        <p className="font-mono" style={{ fontSize: 10, color: 'var(--ghost2)' }}>
          we'll reach out when founding access opens.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[8px] w-full" style={{ maxWidth: 420 }}>
      <label
        htmlFor={emailId}
        className="font-mono"
        style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ghost2)' }}
      >
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
          style={{
            background: 'rgba(255,255,255,.05)',
            border: '1px solid var(--hairline2)',
            color: 'var(--mist)',
            fontSize: 13.5,
            cursor: 'text',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline2)'; e.currentTarget.style.boxShadow = '' }}
        />
        <button
          type="submit"
          disabled={state === 'loading' || !email.trim()}
          aria-busy={state === 'loading'}
          className="btn-phosphor flex-shrink-0"
          style={{ fontSize: 13, opacity: (state === 'loading' || !email.trim()) ? 0.5 : 1, cursor: (state === 'loading' || !email.trim()) ? 'not-allowed' : 'pointer' }}
        >
          {state === 'loading' ? 'sending…' : 'Get founding access'}
        </button>
      </form>

      {state === 'error' && (
        <p className="font-mono" style={{ fontSize: 11, color: '#ff8080' }} role="alert">{errMsg}</p>
      )}

      {/* Social proof + microcopy */}
      <div className="flex items-center justify-between flex-wrap gap-[6px]">
        <p className="font-mono" style={{ fontSize: 10, color: 'var(--ghost2)' }}>
          no charge now · 50% off at launch
        </p>
        <div className="flex items-center gap-[5px] font-mono" style={{ fontSize: 10, color: 'var(--ghost2)' }}>
          <span
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 6px var(--phosphor-glow)', display: 'inline-block', animation: 'breathe 3s var(--ease) infinite' }}
          />
          {WAITLIST_COUNT} on the founding list
        </div>
      </div>
    </div>
  )
}
