'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/apple/Reveal'
import { capture } from '@/lib/posthog'
import { USE_CASES, type UseCase } from '@/lib/home'
import { SectionHead } from './SectionHead'
import { DemoSlot } from './DemoSlot'

// Each source mock shows the same values the record on the right ends up
// with, so the eye can match them across the arrow.
function SourceMock({ uc }: { uc: UseCase }) {
  const v = Object.fromEntries(uc.record)
  const card: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E5E0D8',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 12px 32px -18px rgba(26,26,26,.25)',
    textAlign: 'left',
  }
  const url = (u: string) => (
    <div className="flex items-center" style={{ gap: 6, padding: '8px 12px', borderBottom: '1px solid #EFEBE4', background: '#F7F5F1' }}>
      {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#D9D3C9' }} />)}
      <span className="font-mono" style={{ marginLeft: 6, fontSize: 11, color: '#8A857D' }}>{u}</span>
    </div>
  )

  if (uc.id === 'networking')
    return (
      <div style={card}>
        {url('linkedin.com/in/jordan-ellis')}
        <div style={{ height: 54, background: 'linear-gradient(120deg,#9CC3DA,#A9D3B0)' }} />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#6E7688', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 600, marginTop: -28, border: '3px solid #fff' }}>JE</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: '#1A1A1A', marginTop: 8 }}>{v.Name}</div>
          <div style={{ fontSize: 14, color: '#1A1A1A', marginTop: 2 }}>{v.Role} at {v.Company}</div>
          <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 4 }}>{v.Location} · 500+ connections</div>
          <div className="flex" style={{ gap: 8, marginTop: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, background: '#1A1A1A', color: '#fff' }}>Message</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, border: '1px solid #1A1A1A', color: '#1A1A1A' }}>Follow</span>
          </div>
        </div>
      </div>
    )

  if (uc.id === 'jobs')
    return (
      <div style={card}>
        {url('careers.halcyonlabs.com/data-analyst')}
        <div style={{ padding: 18 }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <span style={{ width: 36, height: 36, borderRadius: 8, background: '#27354A', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>H</span>
            <span style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 600 }}>{v.Company}</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: '#1A1A1A', marginTop: 14 }}>{v.Role}</div>
          <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 4 }}>{v.Location} · Hybrid · Full-time</div>
          <div className="flex flex-wrap" style={{ gap: 6, marginTop: 12 }}>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#EEF4EC', color: '#2F5D34' }}>{v.Salary}</span>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#F2EFE9', color: '#6B6B6B' }}>SQL · Python</span>
          </div>
          <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 8, background: '#27354A', color: '#fff', marginTop: 16 }}>Apply now</span>
        </div>
      </div>
    )

  if (uc.id === 'apartments')
    return (
      <div style={card}>
        {url('rentals.example.com/214-clermont')}
        <div style={{ height: 96, background: 'linear-gradient(135deg,#D8C7B1 0%,#B9A58C 55%,#8F7F6C 100%)' }} />
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>{v.Rent}</div>
          <div style={{ fontSize: 14, color: '#1A1A1A', marginTop: 4 }}>{v.Beds} · {v['Sq ft']} sq ft</div>
          <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 4 }}>{v.Address}, {v.Neighborhood}, Brooklyn</div>
        </div>
      </div>
    )

  return (
    <div style={card}>
      <div className="flex items-center justify-between" style={{ padding: '8px 12px', borderBottom: '1px solid #EFEBE4', background: '#F7F5F1' }}>
        <span className="font-mono" style={{ fontSize: 11, color: '#8A857D' }}>ebike-adoption.pdf</span>
        <span className="font-mono" style={{ fontSize: 11, color: '#8A857D' }}>p. 3 / 18</span>
      </div>
      <div style={{ padding: 18 }}>
        <div className="font-mono" style={{ fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8A857D' }}>{v.Source} · {v.Date}</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1A1A', marginTop: 8, lineHeight: 1.25 }}>How e-bikes are reshaping short urban trips</div>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#6B6B6B', marginTop: 10 }}>
          Across the six cities studied,{' '}
          <mark style={{ background: '#FBE3C8', color: '#1A1A1A', padding: '0 2px' }}>trips under three miles rose 41%</mark>{' '}
          once shared e-bike fleets passed one vehicle per 400 residents.
        </p>
      </div>
    </div>
  )
}

function RecordCard({ uc }: { uc: UseCase }) {
  return (
    <div
      style={{
        background: 'var(--app-surface-elevated)',
        border: '1px solid #E5E0D8',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 12px 32px -18px rgba(26,26,26,.25)',
        textAlign: 'left',
      }}
    >
      <div className="flex items-center justify-between" style={{ padding: '11px 16px', borderBottom: '1px solid #E5E0D8', background: 'var(--app-chrome)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{uc.label}</span>
        <span className="font-mono" style={{ fontSize: 11, color: '#6B6B6B' }}>new record</span>
      </div>
      <dl>
        {uc.record.map(([k, val], i) => (
          <div
            key={k}
            className="grid"
            style={{ gridTemplateColumns: '112px minmax(0,1fr)', gap: 12, padding: '10px 16px', borderTop: i ? '1px solid #F2EFE9' : 'none', fontSize: 14 }}
          >
            <dt style={{ color: '#6B6B6B' }}>{k}</dt>
            <dd style={{ color: '#1A1A1A', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// Switching tabs: the outgoing demo stays on top (paused on whatever it was showing) until the
// new one's first frames are actually playing, then fades out over ~200ms — a true crossfade,
// never a flash of the empty frame. Only the selected demo ever plays.
const CROSSFADE_MS = 200

export function UseCases() {
  const [active, setActive] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [fading, setFading] = useState(false)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const uc = USE_CASES[active]

  const onIncomingPlaying = useCallback(() => setFading(true), [])
  useEffect(() => {
    if (leaving === null) return
    // Fade once the new demo plays — or after a short grace period if it can't (e.g. reduced motion).
    const grace = setTimeout(() => setFading(true), fading ? 0 : 1200)
    const done = fading ? setTimeout(() => { setLeaving(null); setFading(false) }, CROSSFADE_MS) : undefined
    return () => {
      clearTimeout(grace)
      if (done) clearTimeout(done)
    }
  }, [leaving, fading])

  function select(i: number, focus = false) {
    if (i !== active) {
      setLeaving(active)
      setFading(false)
    }
    setActive(i)
    if (focus) tabs.current[i]?.focus()
    capture('use_case_selected', { use_case: USE_CASES[i].id })
  }

  return (
    <section id="use-cases" className="home-section">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <SectionHead
          eyebrow="use cases"
          title="One shortcut. A hundred trackers."
          body="Same product, a different project for whatever you're keeping track of."
        />
        <Reveal variant="light" index={1}>
          <div
            role="tablist"
            aria-label="Use cases"
            className="flex justify-start sm:justify-center use-case-tabs"
            style={{ gap: 8, marginTop: 28, overflowX: 'auto', paddingBottom: 4 }}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') select((active + 1) % USE_CASES.length, true)
              if (e.key === 'ArrowLeft') select((active - 1 + USE_CASES.length) % USE_CASES.length, true)
            }}
          >
            {USE_CASES.map((u, i) => (
              <button
                key={u.id}
                ref={el => { tabs.current[i] = el }}
                role="tab"
                id={`uc-tab-${u.id}`}
                aria-selected={i === active}
                aria-controls="uc-panel"
                tabIndex={i === active ? 0 : -1}
                type="button"
                className="uc-tab"
                onClick={() => select(i)}
              >
                {u.label}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal variant="light" panel index={2}>
          <div id="uc-panel" role="tabpanel" aria-labelledby={`uc-tab-${uc.id}`} style={{ marginTop: 24, maxWidth: 880, marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ position: 'relative' }}>
              {[...(leaving !== null && leaving !== active ? [leaving] : []), active].map((i) => {
                const u = USE_CASES[i]
                const out = i !== active
                return (
                  <div
                    key={u.id}
                    aria-hidden={out || undefined}
                    style={
                      out
                        ? { position: 'absolute', inset: 0, zIndex: 1, opacity: fading ? 0 : 1, transition: `opacity ${CROSSFADE_MS}ms ease`, pointerEvents: 'none' }
                        : undefined
                    }
                  >
                    <DemoSlot
                      id={`usecase-${u.id}`}
                      active={!out}
                      instant={!out && leaving !== null}
                      onPlaying={out ? undefined : onIncomingPlaying}
                      label={`${u.sourceLabel} becomes a ${u.label.toLowerCase()} record: ${u.record.map(([k, v]) => `${k} ${v}`).join(', ')}.`}
                    >
                      <div className="grid items-center uc-stage">
                        <div className="uc-swap uc-source">
                          <SourceMock uc={u} />
                        </div>
                        <div className="uc-source-chip uc-swap" aria-hidden="true">
                          {u.sourceLabel}
                        </div>
                        <div className="uc-arrow" aria-hidden="true">
                          <span className="uc-arrow-pill">Alt + S</span>
                        </div>
                        <div className="uc-swap" style={{ animationDelay: '.08s' }}>
                          <RecordCard uc={u} />
                        </div>
                      </div>
                    </DemoSlot>
                  </div>
                )
              })}
            </div>
          </div>
          {uc.href && (
            <p style={{ textAlign: 'center', marginTop: 24 }}>
              <a href={uc.href} className="link-warm" style={{ fontSize: 15 }}>More on {uc.label.toLowerCase()} →</a>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
