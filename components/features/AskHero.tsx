'use client'

import { useState, useRef } from 'react'
import { useAnimationLoop } from './useAnimationLoop'
import { useInView } from './useInView'

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b | 0).toString(16).slice(1)
}

// Minimal inline product icons for the ask strip
function ProductTile({ type, color, price }: { type: string; color: string; price: string }) {
  const d = shade(color === '#f0ede8' ? '#c8c4be' : color, -40)
  function Icon() {
    switch (type) {
      case 'jacket': return <svg viewBox="0 0 120 130" style={{ width: '62%' }}><path d="M38 20 L20 40 L10 120 L50 120 L50 65 L70 65 L70 120 L110 120 L100 40 L82 20 L70 30 Q60 38 50 30 Z" fill={color} /><path d="M38 20 L30 14 L10 30 L20 40 Z" fill={d} /><path d="M82 20 L90 14 L110 30 L100 40 Z" fill={d} /></svg>
      case 'sneakers': return <svg viewBox="0 0 130 80" style={{ width: '70%' }}><path d="M10 55 Q20 35 50 32 Q80 30 100 38 L120 50 Q122 60 110 62 L15 65 Z" fill={color} /><path d="M40 32 L45 18 Q55 12 65 18 L60 32" fill={d} opacity=".8" /></svg>
      case 'sunglasses': return <svg viewBox="0 0 130 60" style={{ width: '70%' }}><rect x="5" y="18" width="48" height="30" rx="15" fill={color} /><rect x="77" y="18" width="48" height="30" rx="15" fill={color} /><rect x="53" y="28" width="24" height="5" rx="2.5" fill={d} /></svg>
      case 'backpack': return <svg viewBox="0 0 110 130" style={{ width: '58%' }}><path d="M20 30 Q20 10 55 10 Q90 10 90 30 L95 115 Q95 125 55 125 Q15 125 15 115 Z" fill={color} /><path d="M40 10 Q40 2 55 2 Q70 2 70 10" fill="none" stroke={d} strokeWidth="6" strokeLinecap="round" /></svg>
      default: return <svg viewBox="0 0 120 134" style={{ width: '56%' }}><path d="M18 36 H102 L98 66 L86 126 H64 L60 76 L56 126 H34 L22 66 Z" fill={color} /><rect x="18" y="30" width="84" height="11" rx="2.5" fill={d} /></svg>
    }
  }
  return (
    <div style={{ flex: 1, position: 'relative', aspectRatio: '4/5', borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(165deg,#f8f7f4,#eae8e2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,.05)' }}>
      <Icon />
      <span style={{ position: 'absolute', top: 4, right: 5, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 6.5, color: '#333', background: 'rgba(255,255,255,.75)', borderRadius: 3, padding: '1px 3px' }}>{price}</span>
    </div>
  )
}

const STRIP = [
  { type: 'shorts',     color: '#4f6740', price: '$48' },
  { type: 'jacket',     color: '#2a3a4a', price: '$340' },
  { type: 'sneakers',   color: '#c0392b', price: '$120' },
  { type: 'sunglasses', color: '#1a1a2e', price: '$165' },
  { type: 'backpack',   color: '#5b6e7f', price: '$115' },
]

interface AnsData { main: string; sub: string; link: string }

export function AskHero() {
  const { ref, inView } = useInView()
  const [query, setQuery]   = useState('')
  const [answer, setAnswer] = useState<AnsData | null>(null)
  const typeTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  function clearType() { typeTimers.current.forEach(clearTimeout); typeTimers.current = [] }

  function typeText(text: string, msPerChar = 36) {
    clearType()
    text.split('').forEach((_, i) => {
      typeTimers.current.push(setTimeout(() => setQuery(text.slice(0, i + 1)), i * msPerChar))
    })
  }

  function reset() { clearType(); setQuery(''); setAnswer(null) }

  useAnimationLoop([
    { ms: 600,  action: () => typeText('which is cheapest?') },
    { ms: 1900, action: () => setAnswer({ main: 'H&M Regular Short — $17.99', sub: 'cheapest of 14 · $17.99–$68.00', link: 'open hm.com ↗' }) },
    { ms: 3500, action: () => { setAnswer(null); setQuery(''); typeText('under $30?') } },
    { ms: 4500, action: () => setAnswer({ main: '5 under $30', sub: 'H&M · Uniqlo · Target · Old Navy · Gap', link: 'open ↗' }) },
  ], 6600, reset, inView)

  return (
    <div ref={ref} className="absolute inset-0">
      {/* Glass panel matching .askp */}
      <div style={{ position: 'absolute', inset: 14, borderRadius: 12, border: '1px solid var(--hairline2)', background: 'linear-gradient(180deg,rgba(18,20,26,.97),rgba(12,13,18,.99))', zIndex: 8, padding: 16, display: 'flex', flexDirection: 'column' }}>
        {/* Product strip */}
        <div style={{ display: 'flex', gap: 9 }}>
          {STRIP.map((item, i) => <ProductTile key={i} type={item.type} color={item.color} price={item.price} />)}
        </div>

        {/* Label */}
        <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, color: 'var(--ghost2)', marginTop: 11, letterSpacing: '.06em' }}>
          from your captures · 14 items
        </div>

        {/* Ask bar */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 11, background: 'rgba(0,0,0,.4)', border: '1px solid var(--hairline2)' }}>
          <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, color: 'var(--ghost2)' }}>ask</span>
          <div style={{ flex: 1, fontSize: 13, color: 'var(--mist)', minHeight: 16 }}>
            {query}
            {query && (
              <span style={{ display: 'inline-block', width: 1.5, height: 13, background: 'var(--phosphor)', verticalAlign: -2, animation: 'blink 1s steps(1) infinite' }} />
            )}
          </div>
        </div>

        {/* Answer */}
        {answer && (
          <div style={{ marginTop: 10, borderRadius: 11, padding: '11px 13px', background: 'linear-gradient(180deg,rgba(174,194,255,.1),rgba(174,194,255,.04))', border: '1px solid rgba(174,194,255,.3)', display: 'flex', alignItems: 'center', gap: 10, opacity: 1, transform: 'none', transition: '.35s var(--ease)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#EAF0FF' }}>{answer.main}</div>
              <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, color: 'var(--ghost)', marginTop: 2 }}>{answer.sub}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: 'var(--phosphor)', border: '1px solid rgba(174,194,255,.35)', borderRadius: 8, padding: '6px 9px', whiteSpace: 'nowrap' }}>{answer.link}</span>
          </div>
        )}
      </div>
    </div>
  )
}
