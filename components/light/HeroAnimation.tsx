'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/components/features/useInView'
import { useAnimationLoop } from '@/components/features/useAnimationLoop'

// Placeholder mock UI — not real screenshots; permanent supporting graphic
// language (simple vector suggestions), not a placeholder-pending-real-
// assets situation. See docs/superpowers/specs/2026-08-20-homepage-
// animation-pass-design.md §4b.

type CardVariant = 'message' | 'table' | 'chart' | 'paragraph'

type CardDef = {
  id: string
  scattered: { x: number; y: number; rotate: number }
  converged: { x: number; y: number }
  time: string
  variant: CardVariant
  driftDuration: number
  driftDelay: number
  parallaxFactor: number
}

const CARDS: CardDef[] = [
  { id: 'c1', scattered: { x: 30,  y: 20,  rotate: -6 }, converged: { x: 500, y: 10 },  time: '9:12 AM',  variant: 'paragraph', driftDuration: 7,   driftDelay: 0,    parallaxFactor: 6 },
  { id: 'c2', scattered: { x: 150, y: 90,  rotate: 5 },  converged: { x: 500, y: 62 },  time: '9:45 AM',  variant: 'message',   driftDuration: 8,   driftDelay: -2,   parallaxFactor: 9 },
  { id: 'c3', scattered: { x: 270, y: 10,  rotate: -3 }, converged: { x: 500, y: 114 }, time: '10:15 AM', variant: 'table',     driftDuration: 6,   driftDelay: -1,   parallaxFactor: 5 },
  { id: 'c4', scattered: { x: 400, y: 60,  rotate: 7 },  converged: { x: 500, y: 166 }, time: '11:05 AM', variant: 'chart',     driftDuration: 9,   driftDelay: -4,   parallaxFactor: 12 },
  { id: 'c5', scattered: { x: 500, y: 130, rotate: -5 }, converged: { x: 500, y: 218 }, time: '1:30 PM',  variant: 'paragraph', driftDuration: 7.5, driftDelay: -3,   parallaxFactor: 7 },
  { id: 'c6', scattered: { x: 60,  y: 210, rotate: 3 },  converged: { x: 500, y: 270 }, time: '2:50 PM',  variant: 'message',   driftDuration: 6.5, driftDelay: -5,   parallaxFactor: 14 },
  { id: 'c7', scattered: { x: 220, y: 260, rotate: -7 }, converged: { x: 500, y: 322 }, time: '3:40 PM',  variant: 'table',     driftDuration: 8.5, driftDelay: -2.5, parallaxFactor: 4 },
  { id: 'c8', scattered: { x: 380, y: 230, rotate: 6 },  converged: { x: 500, y: 374 }, time: '4:00 PM',  variant: 'chart',     driftDuration: 7.2, driftDelay: -1.5, parallaxFactor: 10 },
]

type Phase = 'scattered' | 'converging' | 'held' | 'dispersing'

function CardContent({ variant }: { variant: CardVariant }) {
  const bar = (w: string) => <div style={{ height: 4, width: w, borderRadius: 2, background: '#D8D4CC' }} />
  if (variant === 'message') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 10 }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#E5E0D8' }} />
        {bar('70%')}
        {bar('45%')}
      </div>
    )
  }
  if (variant === 'table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10 }}>
        {bar('90%')}{bar('60%')}{bar('75%')}
      </div>
    )
  }
  if (variant === 'chart') {
    return (
      <svg viewBox="0 0 60 30" style={{ width: '100%', height: 30, padding: 10 }} aria-hidden="true">
        <polyline points="0,25 15,15 30,20 45,5 60,10" fill="none" stroke="#C7C2B8" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 10 }}>
      {bar('95%')}{bar('80%')}{bar('88%')}{bar('50%')}
    </div>
  )
}

function TypedTimestamp({ text, active }: { text: string; active: boolean }) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setTyped(''), 0)
      return () => clearTimeout(t)
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers: ReturnType<typeof setTimeout>[] = []
    if (prefersReduced) {
      timers.push(setTimeout(() => setTyped(text), 0))
      return () => timers.forEach(clearTimeout)
    }
    timers.push(setTimeout(() => {
      for (let i = 1; i <= text.length; i++) {
        timers.push(setTimeout(() => setTyped(text.slice(0, i)), i * 50))
      }
    }, 200))
    return () => timers.forEach(clearTimeout)
  }, [active, text])
  return <>{typed}</>
}

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

  useAnimationLoop(
    [
      { ms: 8000, action: () => setPhase('converging') },
      { ms: 11000, action: () => setPhase('held') },
      { ms: 14000, action: () => setPhase('dispersing') },
    ],
    16000,
    reset,
    inView && !reducedMotion,
  )

  // Land timestamps as convergence completes (~3s transition), lightly
  // staggered per card so the typing effect doesn't all fire at once.
  useEffect(() => {
    if (phase !== 'converging') return
    const timers = CARDS.map((c, i) =>
      setTimeout(() => setLandedIds(prev => new Set(prev).add(c.id)), 3000 + i * 60),
    )
    return () => timers.forEach(clearTimeout)
  }, [phase])

  // Cursor parallax: one shared rAF loop, direct style mutation (no React
  // state per frame — avoids layout thrash), lerp 0.08/frame toward the
  // pointer-opposite target. Disabled during converging/held and on touch.
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

  return (
    <div ref={containerRef} className="relative w-full" style={{ aspectRatio: '16 / 10', background: '#FAF8F5' }}>
      {CARDS.map(c => {
        const pos = showConverged ? c.converged : c.scattered
        const rotate = showConverged ? 0 : c.scattered.rotate
        const landed = reducedMotion || landedIds.has(c.id)
        return (
          <div
            key={c.id}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotate}deg)`,
              transition: `transform ${phase === 'converging' ? '3000ms' : phase === 'dispersing' ? '2000ms' : '0ms'} var(--ease-warm)`,
            }}
          >
            <div ref={el => { parallaxRefs.current[c.id] = el }} style={{ transform: 'translate(0,0)' }}>
              <div
                className="hero-anim-drift"
                style={{ '--drift-duration': `${c.driftDuration}s`, '--drift-delay': `${c.driftDelay}s`, animationPlayState: phase === 'scattered' ? 'running' : 'paused' } as React.CSSProperties}
              >
                <div style={{ width: 76, borderRadius: 10, background: '#fff', boxShadow: '0 8px 20px -8px rgba(26,26,26,.2)', overflow: 'hidden' }}>
                  <CardContent variant={c.variant} />
                </div>
                {showConverged && (
                  <div className="font-mono" style={{ marginTop: 4, fontSize: 10, color: '#6B6B6B', textAlign: 'right' }}>
                    <TypedTimestamp text={c.time} active={landed} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
