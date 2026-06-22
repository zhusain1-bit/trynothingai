'use client'

import { useState, useRef, useCallback, type CSSProperties } from 'react'
import { SnipOverlay, SNIP_INITIAL, type SnipState } from './SnipOverlay'
import { useAnimationLoop } from './useAnimationLoop'
import { useInView } from './useInView'

const DAYS_HEADER = ['S','M','T','W','T','F','S']
// March 2026 starts on Sunday (day 0)
const MARCH_2026 = Array.from({ length: 37 }, (_, i) => {
  const d = i - 0 + 1   // starts Sunday
  return d >= 1 && d <= 31 ? d : null
})

export function CalendarHero() {
  const { ref: containerRef, inView } = useInView()
  const stageRef   = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)

  const [snip, setSnip]       = useState<SnipState>(SNIP_INITIAL)
  const [popShow, setPopShow]  = useState(false)
  const [popDone, setPopDone]  = useState(false)
  const [pressing, setPressing] = useState(false)
  const [calShow, setCalShow]  = useState(false)
  const [pillShow, setPillShow] = useState(false)

  function reset() {
    setSnip(SNIP_INITIAL)
    setPopShow(false); setPopDone(false); setPressing(false)
    setCalShow(false); setPillShow(false)
  }

  const measureSel = useCallback(() => {
    const stage = stageRef.current, info = infoRef.current
    if (!stage || !info) return
    const sr = stage.getBoundingClientRect(), ir = info.getBoundingClientRect()
    const base: CSSProperties = {
      left: ir.left - sr.left - 6,
      top:  ir.top  - sr.top  - 6,
      width: 0, height: 0,
    }
    setSnip(s => ({ ...s, selShow: true, selStyle: base }))
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setSnip(s => ({ ...s, selStyle: { ...base, width: ir.width + 12, height: ir.height + 12 } }))
    }))
  }, [])

  useAnimationLoop([
    { ms: 700,  action: () => setSnip(s => ({ ...s, dimShow: true,  toolShow: true })) },
    { ms: 1250, action: measureSel },
    { ms: 2350, action: () => setSnip(s => ({ ...s, dimShow: false, toolShow: false, selShow: false, scrimShow: true, flashKey: s.flashKey + 1 })) },
    { ms: 2800, action: () => setPopShow(true) },
    { ms: 4200, action: () => setPressing(true) },
    { ms: 4600, action: () => { setPressing(false); setPopDone(true); setCalShow(true) } },
    { ms: 5050, action: () => setPillShow(true) },
  ], 8200, reset, inView)

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ overflow: 'hidden' }}>
      <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>

        {/* ── Source: dice.fm page ── */}
        <div style={{ position: 'absolute', inset: 0, background: '#fff', color: '#1a1a1d', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 5 }}>
          {/* Browser chrome */}
          <div style={{ height: 28, background: '#ececE7', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', borderBottom: '1px solid #d8d8d2', flexShrink: 0 }}>
            <span style={{ color: '#aaa', fontSize: 13, lineHeight: 1, userSelect: 'none' }}>‹ ›</span>
            <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9.5, color: '#666', background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: '3px 11px', flex: 1, maxWidth: '58%' }}>dice.fm/event/beach-house</span>
          </div>

          {/* Event page body */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px' }}>
            {/* Artist photo block */}
            <div style={{ height: '38%', borderRadius: 9, position: 'relative', overflow: 'hidden', background: 'linear-gradient(155deg,#3a2a5e,#171028)', display: 'flex', alignItems: 'flex-end', padding: 10, flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 50% at 70% 30%,rgba(255,90,140,.55),transparent 60%),radial-gradient(45% 45% at 22% 65%,rgba(120,90,255,.5),transparent 60%)' }} />
              <div style={{ position: 'relative', fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-.01em', textShadow: '0 2px 10px rgba(0,0,0,.4)' }}>Beach House</div>
            </div>

            {/* Infozone — date/venue (this is what gets snipped) */}
            <div ref={infoRef} style={{ marginTop: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em', color: '#1a1a1d' }}>Beach House — Once Twice Melody Tour</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, fontSize: 13, fontWeight: 500, color: '#2a2a2d' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6a6a6a" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>
                Saturday, March 14, 2026 · 8:00 PM
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, fontSize: 13, fontWeight: 500, color: '#2a2a2d' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6a6a6a" strokeWidth="2"><path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>
                Brooklyn Steel · 319 Frost St, Brooklyn NY
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13 }}>From <strong style={{ fontSize: 15 }}>$45.00</strong></div>
              <div style={{ background: '#d6452a', color: '#fff', fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 7 }}>Get tickets</div>
            </div>
          </div>
        </div>

        {/* Snip overlay layers */}
        <SnipOverlay {...snip} />

        {/* Calendar widget — top right */}
        <div
          style={{
            position: 'absolute', right: '5%', top: '9%', width: 190, zIndex: 48,
            opacity: calShow ? 1 : 0,
            transform: calShow ? 'none' : 'translateY(-8px)',
            transition: '.45s var(--ease)',
            background: 'linear-gradient(180deg,rgba(22,24,30,.95),rgba(12,13,18,.97))',
            backdropFilter: 'blur(18px)',
            border: '1px solid var(--hairline2)',
            borderRadius: 12,
            padding: 12,
            boxShadow: '0 22px 56px -18px rgba(0,0,0,.85)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, color: 'var(--ghost2)', marginBottom: 6, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            March 2026
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {DAYS_HEADER.map((d, i) => (
              <div key={i} style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 7, color: 'var(--ghost2)', textAlign: 'center' }}>{d}</div>
            ))}
            {MARCH_2026.map((d, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1', borderRadius: 4, background: 'rgba(255,255,255,.04)',
                  fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 8,
                  color: d === 14 ? '#EAF0FF' : 'var(--ghost2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {d === 14 ? (
                  <>
                    <span style={{ opacity: .35 }}>14</span>
                    <span
                      style={{
                        position: 'absolute', inset: 1, borderRadius: 4,
                        background: 'linear-gradient(180deg,rgba(174,194,255,.42),rgba(174,194,255,.2))',
                        border: '1px solid rgba(174,194,255,.55)',
                        boxShadow: '0 0 11px var(--phosphor-glow)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 7.5, color: '#0a0b0d', fontWeight: 700,
                        opacity: pillShow ? 1 : 0,
                        transform: pillShow ? 'none' : 'scale(.6)',
                        transition: '.4s var(--ease)',
                      }}
                    >
                      14
                    </span>
                  </>
                ) : d}
              </div>
            ))}
          </div>
        </div>

        {/* Detection popup */}
        <div
          style={{
            position: 'absolute', left: '5%', bottom: '7%', zIndex: 50,
            width: 'clamp(240px,54%,300px)',
            borderRadius: 14,
            opacity: popShow ? 1 : 0,
            transform: popShow ? 'none' : 'translateY(14px)',
            background: 'linear-gradient(180deg,rgba(22,24,30,.95),rgba(12,13,18,.97))',
            backdropFilter: 'blur(22px)',
            border: '1px solid var(--hairline2)',
            boxShadow: '0 28px 70px -20px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.07)',
            transition: '.45s var(--ease)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, padding: 13 }}>
            {/* Snapshot thumbnail */}
            <div style={{ flexShrink: 0, width: 54, aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline2)', background: 'linear-gradient(160deg,#3a2a5e,#171028)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 9, color: '#fff', textAlign: 'center', lineHeight: .9, textShadow: '0 1px 4px #000' }}>Beach<br/>House</div>
            </div>
            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, letterSpacing: '.13em', textTransform: 'uppercase', color: popDone ? 'var(--phosphor)' : 'var(--ghost)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block', flexShrink: 0 }} />
                {popDone ? 'Added to calendar' : 'Event detected'}
              </div>
              <div style={{ marginTop: 7, fontSize: 13, fontWeight: 600, color: 'var(--mist)' }}>Beach House — live</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: 'var(--ghost)', lineHeight: 1.5 }}>
                Sat Mar 14, 2026 · 8:00 PM<br/>Brooklyn Steel
              </div>
              <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 8, color: 'var(--ghost2)', marginTop: 5 }}>read from dice.fm</div>
            </div>
          </div>
          {!popDone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 13px 13px' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 13px', borderRadius: 10, fontSize: 12.5, fontWeight: 500,
                  color: '#EAF0FF',
                  background: 'linear-gradient(180deg,rgba(174,194,255,.2),rgba(174,194,255,.1))',
                  border: '1px solid rgba(174,194,255,.45)',
                  boxShadow: pressing ? '0 0 20px -2px var(--phosphor-glow)' : '0 5px 18px -8px var(--phosphor-glow)',
                  transform: pressing ? 'scale(.96)' : 'none',
                  transition: '.2s',
                }}
              >
                Add to Calendar
                <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 5, padding: '1px 5px' }}>⏎</span>
              </span>
              <span style={{ fontSize: 12, color: 'var(--ghost2)' }}>Dismiss</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
