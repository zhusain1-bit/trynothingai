'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'

/**
 * Password recovery, completed in the browser.
 *
 * Supabase runs the IMPLICIT flow here, not PKCE: the desktop app asks for the reset
 * (POST /recover with no code_challenge) but the browser finishes it, so a PKCE code_verifier
 * could never be shared between the two. GoTrue therefore 303s to this page with the session in
 * the URL *fragment* — `#access_token=…&type=recovery` on success, `#error_code=otp_expired` on a
 * dead link. Fragments are never sent to the server, which is what makes this safe on a static
 * marketing site: the token reaches this component and nothing else.
 */

// Publishable client credentials (the anon key is RLS-gated and already ships inside the desktop
// app). Optional + guarded, like every other env var here — an unset value must not break the build.
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null

const MIN_PASSWORD = 6 // matches the desktop app's validAcct() and GoTrue's default

type Phase = 'checking' | 'ready' | 'nolink' | 'expired' | 'unavailable' | 'success'
type FormState = 'idle' | 'loading' | 'error'

export function ResetClient() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [token, setToken] = useState<string | null>(null)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errMsg, setErrMsg] = useState('')

  const pwId = useId()
  const pw2Id = useId()

  useEffect(() => {
    if (!SB_URL || !SB_ANON) {
      setPhase('unavailable')
      return
    }
    const p = new URLSearchParams(window.location.hash.slice(1))
    const access = p.get('access_token')
    const errCode = p.get('error_code') ?? p.get('error')

    // Strip the fragment before anything else can read it — an access token sitting in the address
    // bar is one careless copy-paste away from being shared.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    if (errCode) setPhase('expired')
    else if (access) {
      setToken(access)
      setPhase('ready')
    } else setPhase('nolink')
  }, [])

  const tooShort = pw.length < MIN_PASSWORD
  const mismatch = pw2.length > 0 && pw !== pw2
  const canSubmit = !tooShort && pw === pw2 && formState !== 'loading'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !token) return
    setFormState('loading')
    setErrMsg('')
    try {
      const res = await fetch(`${SB_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          apikey: SB_ANON as string,
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ password: pw }),
      })
      if (res.status === 401 || res.status === 403) {
        // The recovery session died between landing here and submitting.
        setPhase('expired')
        return
      }
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { msg?: string; message?: string; error_description?: string }
        throw new Error(j.error_description || j.msg || j.message || 'Could not update your password.')
      }
      setPhase('success')
    } catch (err) {
      setFormState('error')
      setErrMsg(err instanceof Error ? err.message : 'Could not update your password.')
    }
  }

  if (phase === 'checking') return null

  if (phase === 'success') {
    return (
      <Message
        icon
        eyebrow="password updated"
        title={<>You&rsquo;re set.</>}
        body={
          <>
            Your password has been changed. Head back to the{' '}
            <strong style={{ color: 'var(--mist)' }}>nothing.ai</strong> app, open Settings, and sign
            in with your new password.
          </>
        }
      />
    )
  }

  if (phase === 'expired') {
    return (
      <Message
        eyebrow="link expired"
        title="This link no longer works."
        body={
          <>
            Reset links are single-use and expire after a short while. Open the{' '}
            <strong style={{ color: 'var(--mist)' }}>nothing.ai</strong> app, go to Settings, and
            choose <em style={{ color: 'var(--mist)', fontStyle: 'normal' }}>forgot password?</em> to
            send yourself a fresh one.
          </>
        }
      />
    )
  }

  if (phase === 'nolink') {
    return (
      <Message
        eyebrow="password reset"
        title="Check your link."
        body={
          <>
            This page opens from the reset link we email you. To get one, open the{' '}
            <strong style={{ color: 'var(--mist)' }}>nothing.ai</strong> app, go to Settings, and
            choose <em style={{ color: 'var(--mist)', fontStyle: 'normal' }}>forgot password?</em>
          </>
        }
      />
    )
  }

  if (phase === 'unavailable') {
    return (
      <Message
        eyebrow="password reset"
        title="Reset is unavailable."
        body={
          <>
            Password reset isn&rsquo;t configured right now. Email hi@trynothingai.com and we&rsquo;ll
            sort it out for you.
          </>
        }
      />
    )
  }

  // phase === 'ready'
  return (
    <>
      <span className="font-mono uppercase tracking-[.2em]" style={{ fontSize: 11, color: 'var(--phosphor)' }}>
        password reset
      </span>

      <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(26px,4vw,38px)', color: 'var(--mist)' }}>
        Set a new password.
      </h1>

      <form
        className="surface w-full p-[26px] flex flex-col gap-[14px] text-left"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Set a new password"
      >
        <Field
          id={pwId}
          label="new password"
          value={pw}
          onChange={setPw}
          disabled={formState === 'loading'}
          autoComplete="new-password"
          placeholder={`at least ${MIN_PASSWORD} characters`}
        />
        <Field
          id={pw2Id}
          label="confirm password"
          value={pw2}
          onChange={setPw2}
          disabled={formState === 'loading'}
          autoComplete="new-password"
          placeholder="type it again"
        />

        {mismatch && (
          <p className="font-mono" style={{ fontSize: 11, color: '#ff8080' }} role="alert">
            passwords don&rsquo;t match
          </p>
        )}
        {formState === 'error' && (
          <p className="font-mono" style={{ fontSize: 11, color: '#ff8080' }} role="alert">
            {errMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          aria-busy={formState === 'loading'}
          className="btn-phosphor justify-center py-[10px]"
          style={{
            fontSize: 13.5,
            opacity: canSubmit ? 1 : 0.45,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {formState === 'loading' ? 'updating…' : 'update password'}
        </button>
      </form>

      <p className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)', marginTop: 4 }}>
        questions? hi@trynothingai.com
      </p>
    </>
  )
}

/** A non-form outcome state, matching the /confirmed page's layout exactly. */
function Message({
  icon,
  eyebrow,
  title,
  body,
}: {
  icon?: boolean
  eyebrow: string
  title: React.ReactNode
  body: React.ReactNode
}) {
  return (
    <div
      className="flex flex-col items-center text-center gap-[20px]"
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div
          className="rounded-full flex items-center justify-center font-mono"
          style={{
            width: 40,
            height: 40,
            border: '1.5px solid var(--phosphor)',
            color: 'var(--phosphor)',
            boxShadow: '0 0 20px var(--phosphor-glow)',
            fontSize: 18,
          }}
        >
          ✓
        </div>
      )}

      <span
        className="font-mono uppercase tracking-[.2em]"
        style={{ fontSize: 11, color: icon ? 'var(--phosphor)' : 'var(--ghost2)' }}
      >
        {eyebrow}
      </span>

      <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(26px,4vw,38px)', color: 'var(--mist)' }}>
        {title}
      </h1>

      <p style={{ fontSize: 15, color: 'var(--ghost)', lineHeight: 1.65, maxWidth: 400 }}>{body}</p>

      <Link href="/" className="btn-phosphor" style={{ fontSize: 13, marginTop: 4, minHeight: 44 }}>
        back to nothing.ai
      </Link>

      <p className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)', marginTop: 4 }}>
        questions? hi@trynothingai.com
      </p>
    </div>
  )
}

/** Password input, styled exactly like the waitlist form's field. */
function Field({
  id,
  label,
  value,
  onChange,
  disabled,
  autoComplete,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  disabled: boolean
  autoComplete: string
  placeholder: string
}) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label
        htmlFor={id}
        className="font-mono"
        style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ghost2)' }}
      >
        {label}
      </label>
      <input
        id={id}
        type="password"
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        aria-required="true"
        className="rounded-[10px] px-[12px] py-[9px] outline-none transition-shadow"
        style={{
          background: 'rgba(0,0,0,.35)',
          border: '1px solid var(--hairline2)',
          color: 'var(--mist)',
          fontSize: 13.5,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--hairline2)'
          e.currentTarget.style.boxShadow = ''
        }}
      />
    </div>
  )
}
