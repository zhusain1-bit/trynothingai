'use client'

import { useState, useEffect, useId } from 'react'
import { capture, getSource } from '@/lib/posthog'

type State = 'idle' | 'loading' | 'success' | 'error'

export function StickyWaitlistBar() {
  const emailId  = useId()
  const [visible,      setVisible]      = useState(false)
  const [dismissed,    setDismissed]    = useState(false)
  const [nearWaitlist, setNearWaitlist] = useState(false)
  const [email,        setEmail]        = useState('')
  const [state,        setState]        = useState<State>('idle')
  const [errMsg,       setErrMsg]       = useState('')

  // Show once user scrolls past ~70% of first viewport
  useEffect(() => {
    const threshold = window.innerHeight * 0.7
    function onScroll() { setVisible(window.scrollY > threshold) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hide while the main waitlist section is on screen — no duplicate email fields
  useEffect(() => {
    const target = document.getElementById('waitlist')
    if (!target) return
    const obs = new IntersectionObserver(
      ([entry]) => setNearWaitlist(entry.isIntersecting),
      { threshold: 0.2 },
    )
    obs.observe(target)
    return () => obs.disconnect()
  }, [])

  // Auto-hide after success
  useEffect(() => {
    if (state !== 'success') return
    const t = setTimeout(() => setDismissed(true), 2500)
    return () => clearTimeout(t)
  }, [state])

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
      if (res.ok && data.ok) {
        setState('success')
        capture('waitlist_signup', { source: getSource(), location: 'sticky_bar', has_context: false })
      } else {
        setState('error')
        setErrMsg(data.error ?? 'Something went wrong — try again.')
      }
    } catch {
      setState('error')
      setErrMsg('Something went wrong — try again.')
    }
  }

  const show = visible && !dismissed && !nearWaitlist

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .35s var(--ease)',
        background: 'rgba(10,11,13,.94)',
        backdropFilter: 'blur(20px) saturate(1.1)',
        borderTop: '1px solid var(--hairline)',
        boxShadow: '0 -20px 48px -16px rgba(0,0,0,.7)',
      }}
      aria-hidden={!show}
      inert={!show}
    >
      <div
        className="w-full max-w-[760px] mx-auto px-4 flex flex-col justify-center gap-[4px]"
        style={{ minHeight: 60, paddingTop: 8, paddingBottom: 8 }}
      >
        {state === 'success' ? (
          <div className="flex items-center gap-[8px] font-mono mx-auto" style={{ fontSize: 13, color: 'var(--phosphor)' }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--phosphor)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, boxShadow: '0 0 10px var(--phosphor-glow)' }}>✓</span>
            you&rsquo;re on the list.
          </div>
        ) : (
          <>
            {state === 'error' && errMsg && (
              <p className="font-mono" style={{ fontSize: 11, color: '#ff8080' }} role="alert">{errMsg}</p>
            )}
            <div className="flex items-center gap-[10px]">
              <label htmlFor={emailId} className="sr-only">Email for waitlist</label>
              <form className="flex gap-[8px] flex-1 min-w-0" onSubmit={handleSubmit} noValidate>
                <input
                  id={emailId}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={state === 'loading'}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 rounded-[10px] px-[12px] py-[8px] outline-none"
                  style={{
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid var(--hairline2)',
                    color: 'var(--mist)',
                    fontSize: 13,
                    minHeight: 44,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline2)'; e.currentTarget.style.boxShadow = '' }}
                />
                <button
                  type="submit"
                  disabled={state === 'loading' || !email.trim()}
                  className="btn-phosphor flex-shrink-0"
                  style={{ fontSize: 13, minHeight: 44, opacity: (state === 'loading' || !email.trim()) ? 0.5 : 1, cursor: (state === 'loading' || !email.trim()) ? 'not-allowed' : 'pointer' }}
                >
                  {state === 'loading' ? 'sending…' : 'get founding access'}
                </button>
              </form>
              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss"
                style={{ flexShrink: 0, background: 'transparent', border: 'none', color: 'var(--ghost2)', fontSize: 18, lineHeight: 1, padding: '0 4px', cursor: 'pointer', minWidth: 32, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--mist)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--ghost2)')}
              >
                ×
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
