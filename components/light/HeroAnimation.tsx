'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/components/features/useInView'
import { useAnimationLoop } from '@/components/features/useAnimationLoop'
import { EntryRow } from './DailyNoteOverlayMock'

// Placeholder mock UI — not real screenshots; permanent supporting graphic
// language (simple vector suggestions with real text at small size), not a
// placeholder-pending-real-assets situation.

type CardId = 'priya' | 'jon' | 'listing' | 'table' | 'chart' | 'email' | 'calendar' | 'doc'

type CardDef = {
  id: CardId
  width: number
  scattered: { x: number; y: number; rotate: number }
  time: string
  summary: string
  driftDuration: number
  driftDelay: number
  parallaxFactor: number
}

// Chronological, matches the order cards land in the converged timeline.
const CARDS: CardDef[] = [
  { id: 'priya',    width: 118, scattered: { x: 20,  y: 15,  rotate: -6 }, time: '9:12 AM',  summary: 'Priya · tour at 4?',        driftDuration: 7,   driftDelay: 0,    parallaxFactor: 6 },
  { id: 'jon',      width: 112, scattered: { x: 340, y: 40,  rotate: 4 },  time: '9:45 AM',  summary: 'Jon · typo on slide 4',     driftDuration: 8,   driftDelay: -2,   parallaxFactor: 9 },
  { id: 'listing',  width: 96,  scattered: { x: 180, y: 108, rotate: -4 }, time: '10:15 AM', summary: '543 East 6th · $2.4M',      driftDuration: 6,   driftDelay: -1,   parallaxFactor: 5 },
  { id: 'table',    width: 70,  scattered: { x: 480, y: 20,  rotate: 6 },  time: '11:05 AM', summary: 'comps — 3 properties',      driftDuration: 9,   driftDelay: -4,   parallaxFactor: 12 },
  { id: 'chart',    width: 96,  scattered: { x: 58,  y: 188, rotate: -3 }, time: '1:30 PM',  summary: 'NOI +4.2%',                 driftDuration: 7.5, driftDelay: -3,   parallaxFactor: 7 },
  { id: 'email',    width: 112, scattered: { x: 398, y: 168, rotate: 5 },  time: '2:50 PM',  summary: 're: closing checklist',     driftDuration: 6.5, driftDelay: -5,   parallaxFactor: 14 },
  { id: 'calendar', width: 88,  scattered: { x: 228, y: 258, rotate: -5 }, time: '3:40 PM',  summary: 'Thu 4:00 PM tour',          driftDuration: 8.5, driftDelay: -2.5, parallaxFactor: 4 },
  { id: 'doc',      width: 100, scattered: { x: 18,  y: 278, rotate: 3 },  time: '4:00 PM',  summary: 'inspection notes',          driftDuration: 7.2, driftDelay: -1.5, parallaxFactor: 10 },
]

// ─── Converged timeline layout — the payoff frame reuses the actual
// EntryRow component from DailyNoteOverlayMock (same rendering used in the
// feature blocks below), scaled down uniformly to fit 8 rows in the hero's
// small frame rather than a hero-only row design. Computed once against a
// 640×400 reference canvas (matches Hero.tsx's maxWidth:640 wrapper + this
// component's own 16:10 aspect ratio).
const REF_W = 640
const REF_H = 400
const ROW_UNSCALED_W = 380
const ROW_UNSCALED_H = 53 // EntryRow's natural rendered height in 'note' view
const COLUMN_PAD = 8
const SCALE = 0.78
const N = CARDS.length
const COLUMN_UNSCALED_HEIGHT = N * ROW_UNSCALED_H + COLUMN_PAD * 2
const COLUMN_SCALED_WIDTH = (ROW_UNSCALED_W + COLUMN_PAD * 2) * SCALE
const COLUMN_SCALED_HEIGHT = COLUMN_UNSCALED_HEIGHT * SCALE
const COLUMN_LEFT_PX = (REF_W - COLUMN_SCALED_WIDTH) / 2
const COLUMN_TOP_PX = (REF_H - COLUMN_SCALED_HEIGHT) / 2
const COLUMN_LEFT_PCT = (COLUMN_LEFT_PX / REF_W) * 100
const COLUMN_TOP_PCT = (COLUMN_TOP_PX / REF_H) * 100

// Approximate target for each detail card's convergence motion — doesn't
// need to be pixel-exact since the card fades out as it arrives, just close
// enough that "card flies toward its row" reads as connected motion.
function rowTargetPx(i: number) {
  return {
    x: COLUMN_LEFT_PX + COLUMN_PAD * SCALE,
    y: COLUMN_TOP_PX + (COLUMN_PAD + i * ROW_UNSCALED_H) * SCALE,
  }
}

// The detailed, light-mode representation — a "captured screen from another
// app." Real text at small size for the labeled specifics (names, amounts,
// headings); filler bars stand in for the rest of the text mass.
function DetailCard({ id }: { id: CardId }) {
  const bar = (w: string, h = 4, tint = false) => (
    <div style={{ height: h, width: w, borderRadius: 2, background: tint ? 'rgba(194,65,12,.35)' : '#D8D4CC' }} />
  )
  if (id === 'priya' || id === 'jon') {
    const name = id === 'priya' ? 'Priya' : 'Jon'
    const rest = id === 'priya' ? 'tour at 4?' : 'typo on slide 4'
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 10px' }}>
        <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: '50%', background: '#E5E0D8', flexShrink: 0 }} />
        <span style={{ fontSize: 9, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <strong style={{ fontWeight: 600 }}>{name}</strong> · {rest}
        </span>
      </div>
    )
  }
  if (id === 'listing') {
    return (
      <div style={{ padding: 8 }}>
        <div aria-hidden="true" style={{ height: 40, borderRadius: 6, background: 'linear-gradient(135deg,#E5E0D8,#D8D4CC)' }} />
        <p style={{ fontSize: 9, color: '#1A1A1A', margin: '6px 0 0', whiteSpace: 'nowrap' }}>543 East 6th · $2.4M</p>
      </div>
    )
  }
  if (id === 'table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8 }}>
        {[0, 1, 2].map(row => (
          <div key={row} style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map(col => (
              <div key={col} style={{ width: 14, height: 12, borderRadius: 2, background: row === 1 ? 'rgba(194,65,12,.18)' : '#EDE9E2' }} />
            ))}
          </div>
        ))}
      </div>
    )
  }
  if (id === 'chart') {
    return (
      <div style={{ padding: 8 }}>
        <svg viewBox="0 0 60 26" style={{ width: '100%', height: 26 }} aria-hidden="true">
          <polyline points="0,22 15,13 30,17 45,4 60,8" fill="none" stroke="#C7C2B8" strokeWidth="2" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ fontSize: 8, color: '#9A968D' }}>Q1–Q4</span>
          <span style={{ fontSize: 9, color: '#C2410C', fontWeight: 600 }}>NOI +4.2%</span>
        </div>
      </div>
    )
  }
  if (id === 'email') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 9 }}>
        <span style={{ fontSize: 9, color: '#1A1A1A', fontWeight: 600, whiteSpace: 'nowrap' }}>re: closing checklist</span>
        {bar('90%')}
        {bar('65%')}
        <span className="font-mono" style={{ fontSize: 8, color: '#9A968D', marginTop: 2 }}>— tyler</span>
      </div>
    )
  }
  if (id === 'calendar') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 10px' }}>
        <svg aria-hidden="true" viewBox="0 0 16 16" style={{ width: 13, height: 13, flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" fill="none" stroke="#9A968D" strokeWidth="1.3" />
          <path d="M8 4v4l3 2" fill="none" stroke="#9A968D" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 9, color: '#1A1A1A', whiteSpace: 'nowrap' }}>Thu 4:00 PM</span>
      </div>
    )
  }
  // doc
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 9 }}>
      <span style={{ fontSize: 9, color: '#1A1A1A', fontWeight: 600, whiteSpace: 'nowrap' }}>inspection notes</span>
      {bar('92%')}
      {bar('80%', 4, true)}
      {bar('55%')}
    </div>
  )
}

type Phase = 'scattered' | 'converging' | 'held' | 'dispersing'

export function HeroAnimation() {
  const { ref: containerRef, inView } = useInView(0.2)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [phase, setPhase] = useState<Phase>('scattered')
  const [landedIds, setLandedIds] = useState<Set<string>>(new Set())
  const parallaxRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const parallaxCurrent = useRef<Record<string, { x: number; y: number }>>({})
  const pointerTarget = useRef({ x: 0, y: 0 })
  const isTouch = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReducedMotion(mq.matches)
    const t = setTimeout(handler, 0)
    mq.addEventListener('change', handler)
    isTouch.current = window.matchMedia('(pointer: coarse)').matches
    return () => { clearTimeout(t); mq.removeEventListener('change', handler) }
  }, [])

  function reset() { setPhase('scattered'); setLandedIds(new Set()) }

  // Landing steps for each card are folded into this SAME steps array rather
  // than a separate useEffect keyed on `phase`. They previously lived in a
  // `useEffect(..., [phase])` whose cleanup fired the instant `phase` became
  // 'held' at ms:11000 -- cancelling any landing timer scheduled after that
  // point (the last few cards land at 8000+3000+i*60, i.e. past 11000ms) and
  // leaving most cards stuck as full-size detail cards forever. Owning every
  // timer for one cycle in useAnimationLoop's own effect (keyed on
  // [enabled, totalMs], not `phase`) means a phase change no longer cancels
  // pending landings.
  useAnimationLoop(
    [
      { ms: 8000, action: () => setPhase('converging') },
      ...CARDS.map((c, i) => ({
        ms: 8000 + 3000 + i * 60,
        action: () => setLandedIds(prev => new Set(prev).add(c.id)),
      })),
      { ms: 11000, action: () => setPhase('held') },
      { ms: 14000, action: () => setPhase('dispersing') },
    ],
    16000,
    reset,
    inView && !reducedMotion,
  )

  // Cursor parallax on the light detail cards only — one shared rAF loop,
  // direct style mutation, lerp 0.08/frame. Disabled during converging/held
  // and on touch.
  useEffect(() => {
    if (reducedMotion || isTouch.current) return
    let raf = 0

    function onPointerMove(e: PointerEvent) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.width / 2
      const cy = rect.height / 2
      pointerTarget.current = { x: (e.clientX - rect.left - cx) / cx, y: (e.clientY - rect.top - cy) / cy }
    }
    function onPointerLeave() { pointerTarget.current = { x: 0, y: 0 } }

    function tick() {
      const active = phase === 'scattered' || phase === 'dispersing'
      for (const c of CARDS) {
        const cur = parallaxCurrent.current[c.id] ?? { x: 0, y: 0 }
        const targetX = active ? -pointerTarget.current.x * c.parallaxFactor : 0
        const targetY = active ? -pointerTarget.current.y * c.parallaxFactor : 0
        const nx = cur.x + (targetX - cur.x) * 0.08
        const ny = cur.y + (targetY - cur.y) * 0.08
        parallaxCurrent.current[c.id] = { x: nx, y: ny }
        const el = parallaxRefs.current[c.id]
        if (el) el.style.transform = `translate(${nx.toFixed(2)}px, ${ny.toFixed(2)}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    const el = containerRef.current
    el?.addEventListener('pointermove', onPointerMove)
    el?.addEventListener('pointerleave', onPointerLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      el?.removeEventListener('pointermove', onPointerMove)
      el?.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(raf)
    }
  }, [phase, reducedMotion, containerRef])

  const showConverged = reducedMotion || phase === 'converging' || phase === 'held'
  const showBackdrop = reducedMotion || phase === 'converging' || phase === 'held'

  return (
    <div ref={containerRef} className="relative w-full" style={{ aspectRatio: '16 / 10', background: 'var(--warm-alt)' }}>
      {/* Converged panel — the actual EntryRow component from
          DailyNoteOverlayMock, scaled down to fit 8 rows in this frame.
          Each row mounts (and plays EntryRow's own entry-row-land fade+rise)
          exactly when its card lands, so the column assembles one row at a
          time; the panel itself fades in/out around them. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `${COLUMN_LEFT_PCT}%`,
          top: `${COLUMN_TOP_PCT}%`,
          width: ROW_UNSCALED_W + COLUMN_PAD * 2,
          transformOrigin: 'top left',
          transform: `scale(${SCALE})`,
          padding: COLUMN_PAD,
          borderRadius: 14,
          background: 'var(--app-surface)',
          border: '1px solid var(--warm-border)',
          boxShadow: '0 24px 56px -20px rgba(194,65,12,.18)',
          opacity: showBackdrop ? 1 : 0,
          transition: `opacity ${phase === 'converging' ? '600ms' : phase === 'dispersing' ? '400ms' : '300ms'} var(--ease-warm)`,
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {CARDS.map((c, i) => {
            const landed = reducedMotion || landedIds.has(c.id)
            if (!landed) return null
            return <EntryRow key={c.id} entry={{ id: c.id, time: c.time, summary: c.summary }} view="note" index={i} />
          })}
        </ul>
      </div>

      {/* Scattered / dispersing detail cards — light, varied sizes, the
          "captured screens from other apps." Cross-fade to invisible once
          their timeline row has landed; reappear as they scatter back out. */}
      {CARDS.map((c, i) => {
        // Detail cards animate toward their own row's approximate slot (not
        // a shared center point) so the motion reads as "this card flies to
        // its spot and dissolves into the row," not "cards converge, then a
        // disconnected row appears elsewhere."
        const pos = showConverged ? rowTargetPx(i) : c.scattered
        const rotate = showConverged ? 0 : c.scattered.rotate
        const landed = reducedMotion || landedIds.has(c.id)
        return (
          <div
            key={`card-${c.id}`}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: c.width,
              transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotate}deg)`,
              opacity: landed ? 0 : 1,
              transition: `transform ${phase === 'converging' ? '3000ms' : phase === 'dispersing' ? '2000ms' : '0ms'} var(--ease-warm), opacity 300ms var(--ease-warm)`,
            }}
          >
            <div ref={el => { parallaxRefs.current[c.id] = el }} style={{ transform: 'translate(0,0)' }}>
              <div
                className="hero-anim-drift"
                style={{ '--drift-duration': `${c.driftDuration}s`, '--drift-delay': `${c.driftDelay}s`, animationPlayState: phase === 'scattered' ? 'running' : 'paused' } as React.CSSProperties}
              >
                <div
                  style={{
                    width: c.width,
                    borderRadius: 10,
                    background: '#fff',
                    border: '1px solid var(--warm-border)',
                    boxShadow: '0 4px 12px rgba(26,26,26,.10)',
                    overflow: 'hidden',
                  }}
                >
                  <DetailCard id={c.id} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
