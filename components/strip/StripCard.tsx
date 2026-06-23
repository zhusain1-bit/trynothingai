'use client'

import { useState, type ReactNode } from 'react'
import { useAnimationLoop } from '@/components/features/useAnimationLoop'
import { useInView } from '@/components/features/useInView'

interface Props {
  name: string
  desc: string
  thumbnail: ReactNode
  toastText: string
  ruleFlag?: string
  soon?: boolean
  delayMs?: number
}

export function StripCard({ name, desc, thumbnail, toastText, ruleFlag, soon, delayMs = 0 }: Props) {
  const { ref, inView } = useInView()
  const [thumbVis, setThumbVis]  = useState(false)
  const [flagVis, setFlagVis]    = useState(false)
  const [flashKey, setFlashKey]  = useState(0)
  const [toastVis, setToastVis]  = useState(false)

  function reset() { setThumbVis(false); setFlagVis(false); setToastVis(false) }

  useAnimationLoop([
    { ms: 300  + delayMs, action: () => setThumbVis(true) },
    { ms: 1000 + delayMs, action: () => { if (ruleFlag) setFlagVis(true) } },
    { ms: 1500 + delayMs, action: () => setFlashKey(k => k + 1) },
    { ms: 1800 + delayMs, action: () => setToastVis(true) },
  ], 4600 + delayMs, reset, inView)

  return (
    <div
      ref={ref}
      style={{ border: '1px solid var(--hairline)', borderRadius: 14, padding: 16, background: 'linear-gradient(180deg,rgba(20,22,28,.55),rgba(12,13,18,.55))', position: 'relative' }}
    >
      {soon && (
        <span style={{ position: 'absolute', top: 11, right: 11, zIndex: 7, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 8, color: 'var(--phosphor)', border: '1px solid rgba(174,194,255,.35)', borderRadius: 6, padding: '2px 6px', background: 'rgba(174,194,255,.06)' }}>
          soon
        </span>
      )}

      {/* Mini stage */}
      <div style={{ position: 'relative', height: 160, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'linear-gradient(160deg,#0f1118,#09090e)', marginBottom: 14 }}>
        {/* Thumbnail */}
        <div
          style={{
            position: 'absolute', left: 12, top: 11, width: 80, aspectRatio: '4/5',
            borderRadius: 9, overflow: 'hidden', border: '1px solid var(--hairline2)',
            boxShadow: '0 12px 26px -12px rgba(0,0,0,.8)',
            opacity: thumbVis ? 1 : 0.12,
            transform: thumbVis ? 'none' : 'translateY(8px) scale(.92)',
            transition: '.45s var(--ease)',
          }}
        >
          {thumbnail}
        </div>

        {/* Rule flag (custom rules card) */}
        {ruleFlag && (
          <div
            style={{
              position: 'absolute', left: '50%', top: '46%',
              transform: `translateX(-50%) translateY(${flagVis ? 0 : 6}px)`,
              zIndex: 6, opacity: flagVis ? 1 : 0, transition: '.4s var(--ease)',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 8.5, color: '#EAF0FF',
              background: 'rgba(16,18,24,.95)', border: '1px dashed rgba(174,194,255,.5)',
              borderRadius: 999, padding: '5px 10px', whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: 'var(--phosphor)' }}>▸</span> {ruleFlag}
          </div>
        )}

        {/* Flash */}
        <div
          key={flashKey}
          style={{
            position: 'absolute', inset: 0, background: '#fff', opacity: 0,
            zIndex: 5,
            animation: flashKey > 0 ? 'snipFlash .4s var(--ease)' : 'none',
          }}
        />

        {/* Toast */}
        <div
          style={{
            position: 'absolute', left: '5%', right: '5%', bottom: 10,
            transform: `translateY(${toastVis ? 0 : 6}px)`,
            opacity: toastVis ? 1 : 0, transition: '.4s var(--ease)',
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 10px', borderRadius: 9,
            background: 'rgba(16,18,24,.95)', border: '1px solid var(--hairline2)',
            fontSize: 9, color: 'var(--mist)',
            boxShadow: '0 10px 26px -12px rgba(0,0,0,.85)', zIndex: 6,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid var(--phosphor)', color: 'var(--phosphor)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, flexShrink: 0, boxShadow: '0 0 8px var(--phosphor-glow)' }}>✓</span>
          {toastText}
        </div>
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--mist)' }}>{name}</div>
      <div style={{ fontSize: 12, color: 'var(--ghost2)', marginTop: 5, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: desc }} />
    </div>
  )
}
