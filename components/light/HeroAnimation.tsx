'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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
        <p style={{ fontSize: 9, color: '#1A1A1A', margin: '6px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>543 East 6th · $2.4M</p>
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

  const showBackdrop = reducedMotion || phase === 'converging' || phase === 'held'

  return (
    <div ref={containerRef} className="relative w-full" style={{ aspectRatio: '16 / 10', background: 'var(--warm-alt)' }}>
      {/* Converged panel — centered backdrop. Rows inside share a layoutId
          with their scattered detail card, so Motion computes the FLIP
          transition from each card's real rendered rect to each row's real
          rendered rect — replaces the old rowTargetPx/COLUMN_* approximate
          math, which is what caused cards to visibly pile up mid-flight. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(380px, 86%)',
          borderRadius: 14,
          background: 'var(--app-surface)',
          border: '1px solid var(--warm-border)',
          boxShadow: '0 24px 56px -20px rgba(194,65,12,.18)',
          padding: 8,
          opacity: showBackdrop ? 1 : 0,
          transition: `opacity ${phase === 'converging' ? '600ms' : phase === 'dispersing' ? '400ms' : '300ms'} var(--ease-warm)`,
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {CARDS.map((c, i) => {
            const landed = reducedMotion || landedIds.has(c.id)
            if (!landed) return null
            return (
              <EntryRow
                key={c.id}
                layoutId={`hero-card-${c.id}`}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                entry={{ id: c.id, time: c.time, summary: c.summary }}
                view="note"
                index={i}
              />
            )
          })}
        </ul>
      </div>

      {/* Scattered / dispersing detail cards — each always renders at its
          own scattered position (drift + cursor parallax on top, both
          unchanged below) until its `landed` flag flips true, at which
          point it unmounts and its layoutId partner above takes over the
          FLIP transition automatically. */}
      <AnimatePresence>
        {CARDS.map(c => {
          const landed = reducedMotion || landedIds.has(c.id)
          if (landed) return null
          return (
            <motion.div
              key={`card-${c.id}`}
              layoutId={`hero-card-${c.id}`}
              layout
              className="absolute"
              style={{
                left: 0,
                top: 0,
                width: c.width,
              }}
              initial={{ opacity: 0, x: c.scattered.x, y: c.scattered.y, rotate: c.scattered.rotate }}
              animate={{ opacity: 1, x: c.scattered.x, y: c.scattered.y, rotate: c.scattered.rotate }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
