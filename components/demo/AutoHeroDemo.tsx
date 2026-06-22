'use client'

import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react'
import { SnipOverlay, SNIP_INITIAL, type SnipState } from '@/components/features/SnipOverlay'

// ── Shared shorts SVG ─────────────────────────────────────────────────
function shadeHex(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b | 0).toString(16).slice(1)
}

// Flat product icon — switches on type, returns a minimal SVG silhouette
function ProductIcon({ type, color }: { type: string; color: string }) {
  const d = shadeHex(color === '#f0ede8' ? '#c8c4be' : color, -40)
  const s = { fill: color }
  switch (type) {
    case 'shorts':
      return (
        <svg viewBox="0 0 120 134" style={{ width: '62%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <path d="M18 36 H102 L98 66 L86 126 H64 L60 76 L56 126 H34 L22 66 Z" {...s} />
          <rect x="18" y="30" width="84" height="11" rx="2.5" fill={d} />
          <line x1="60" y1="41" x2="60" y2="76" stroke={d} strokeWidth="1.2" opacity=".5" />
        </svg>
      )
    case 'jacket':
      return (
        <svg viewBox="0 0 120 130" style={{ width: '62%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <path d="M38 20 L20 40 L10 120 L50 120 L50 65 L70 65 L70 120 L110 120 L100 40 L82 20 L70 30 Q60 38 50 30 Z" fill={color} />
          <path d="M38 20 L30 14 L10 30 L20 40 Z" fill={d} />
          <path d="M82 20 L90 14 L110 30 L100 40 Z" fill={d} />
          <rect x="54" y="20" width="12" height="46" rx="2" fill={d} opacity=".6" />
        </svg>
      )
    case 'sneakers':
      return (
        <svg viewBox="0 0 130 80" style={{ width: '70%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <path d="M10 55 Q20 35 50 32 Q80 30 100 38 L120 50 Q122 60 110 62 L15 65 Z" fill={color} />
          <path d="M10 55 L15 65 L110 62 L120 50 Q115 56 105 58 L20 60 Z" fill={d} />
          <path d="M40 32 L45 18 Q55 12 65 18 L60 32" fill={d} opacity=".8" />
          <ellipse cx="65" cy="60" rx="50" ry="6" fill={d} opacity=".3" />
        </svg>
      )
    case 'sunglasses':
      return (
        <svg viewBox="0 0 130 60" style={{ width: '70%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <rect x="5" y="18" width="48" height="30" rx="15" fill={color} />
          <rect x="77" y="18" width="48" height="30" rx="15" fill={color} />
          <rect x="53" y="28" width="24" height="5" rx="2.5" fill={d} />
          <rect x="0" y="28" width="5" height="14" rx="2.5" fill={d} />
          <rect x="125" y="28" width="5" height="14" rx="2.5" fill={d} />
          <rect x="10" y="24" width="36" height="18" rx="11" fill={d} opacity=".35" />
          <rect x="82" y="24" width="36" height="18" rx="11" fill={d} opacity=".35" />
        </svg>
      )
    case 'backpack':
      return (
        <svg viewBox="0 0 110 130" style={{ width: '60%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <path d="M20 30 Q20 10 55 10 Q90 10 90 30 L95 115 Q95 125 55 125 Q15 125 15 115 Z" fill={color} />
          <path d="M40 10 Q40 2 55 2 Q70 2 70 10" fill="none" stroke={d} strokeWidth="6" strokeLinecap="round" />
          <rect x="30" y="50" width="50" height="35" rx="4" fill={d} opacity=".5" />
          <rect x="25" y="30" width="60" height="8" rx="2" fill={d} opacity=".4" />
        </svg>
      )
    case 'lamp':
      return (
        <svg viewBox="0 0 100 140" style={{ width: '55%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <path d="M50 10 L28 55 L72 55 Z" fill={color} />
          <rect x="46" y="55" width="8" height="70" rx="2" fill={d} />
          <ellipse cx="50" cy="128" rx="22" ry="5" fill={d} />
          <path d="M50 55 Q80 60 80 20" fill="none" stroke={d} strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    case 'chair':
      return (
        <svg viewBox="0 0 120 130" style={{ width: '65%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <ellipse cx="60" cy="55" rx="46" ry="20" fill={color} />
          <path d="M20 70 L15 125" stroke={d} strokeWidth="8" strokeLinecap="round" />
          <path d="M100 70 L105 125" stroke={d} strokeWidth="8" strokeLinecap="round" />
          <path d="M30 70 L28 125" stroke={d} strokeWidth="8" strokeLinecap="round" />
          <path d="M90 70 L92 125" stroke={d} strokeWidth="8" strokeLinecap="round" />
          <path d="M14 75 L14 20 Q14 10 26 10 L34 10 L34 75" fill={color} stroke={d} strokeWidth="1.5" />
        </svg>
      )
    case 'watch':
      return (
        <svg viewBox="0 0 80 130" style={{ width: '45%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <rect x="25" y="0" width="30" height="30" rx="4" fill={d} />
          <rect x="25" y="100" width="30" height="30" rx="4" fill={d} />
          <circle cx="40" cy="65" r="30" fill={color} />
          <circle cx="40" cy="65" r="22" fill={d} opacity=".4" />
          <line x1="40" y1="65" x2="40" y2="48" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="65" x2="52" y2="65" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'tshirt':
      return (
        <svg viewBox="0 0 120 110" style={{ width: '65%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <path d="M40 10 L10 35 L25 50 L35 38 L35 105 L85 105 L85 38 L95 50 L110 35 L80 10 Q70 18 60 18 Q50 18 40 10 Z" fill={color} />
          <path d="M40 10 L10 35 L25 50 L35 38" fill={d} opacity=".7" />
          <path d="M80 10 L110 35 L95 50 L85 38" fill={d} opacity=".7" />
          <path d="M40 10 Q50 22 60 18 Q70 14 80 10" fill="none" stroke={d} strokeWidth="1.5" />
        </svg>
      )
    case 'bag':
      return (
        <svg viewBox="0 0 120 120" style={{ width: '65%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
          <path d="M15 45 L105 45 L100 115 L20 115 Z" fill={color} />
          <path d="M38 45 Q38 20 60 20 Q82 20 82 45" fill="none" stroke={d} strokeWidth="8" strokeLinecap="round" />
          <rect x="15" y="45" width="90" height="12" rx="2" fill={d} opacity=".5" />
          <rect x="45" y="70" width="30" height="22" rx="3" fill={d} opacity=".4" />
        </svg>
      )
    default:
      return <svg viewBox="0 0 80 80" style={{ width: '50%' }}><rect x="10" y="10" width="60" height="60" rx="8" fill={color} /></svg>
  }
}

// ── Mixed product catalogue ───────────────────────────────────────────
const WARD = [
  { type: 'shorts',     label: 'Effortless Short', brand: 'Aritzia',        price: '$48.00', fresh: true,  color: '#4f6740' },
  { type: 'jacket',     label: 'Puffer Jacket',    brand: "Arc'teryx",      price: '$340.00',             color: '#2a3a4a' },
  { type: 'sneakers',   label: 'Air Max 90',       brand: 'Nike',            price: '$120.00',             color: '#c0392b' },
  { type: 'sunglasses', label: 'Wayfarer',         brand: 'Ray-Ban',         price: '$165.00',             color: '#1a1a2e' },
  { type: 'backpack',   label: 'Kånken',           brand: 'Fjällräven',      price: '$115.00',             color: '#5b6e7f' },
  { type: 'lamp',       label: 'Arc Floor Lamp',   brand: 'HAY',             price: '$290.00',             color: '#c8b560' },
  { type: 'chair',      label: 'Eames Shell',      brand: 'Herman Miller',   price: '$425.00',             color: '#e8a87c' },
  { type: 'watch',      label: 'Weekender',        brand: 'Timex',           price: '$89.00',              color: '#8b6914' },
  { type: 'tshirt',     label: 'Classic Tee',      brand: 'Uniqlo',          price: '$19.90',              color: '#c8c4be' },
  { type: 'bag',        label: 'Leather Tote',     brand: 'Everlane',        price: '$168.00',             color: '#8b4513' },
]
const SORTED = [...WARD].sort((a, b) => parseFloat(a.price.replace('$','')) - parseFloat(b.price.replace('$','')))

// ── Ask beat ────────────────────────────────────────────────────────
const ASK_Q   = 'which is cheapest?'
const ASK_ANS = 'Uniqlo Classic Tee — $19.90'
const ASK_SUB = 'cheapest of 10 · $19.90–$425.00'

// ── Component ────────────────────────────────────────────────────────
export function AutoHeroDemo() {
  const stageRef = useRef<HTMLDivElement>(null)
  const infoRef  = useRef<HTMLDivElement>(null)
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([])

  const [snip,       setSnip]       = useState<SnipState>(SNIP_INITIAL)
  const [idleShow,   setIdleShow]   = useState(true)
  const [pageShow,   setPageShow]   = useState(false)
  const [popShow,    setPopShow]    = useState(false)
  const [dropShow,   setDropShow]   = useState(false)
  const [ruleOn,     setRuleOn]     = useState(false)
  const [pressing,   setPressing]   = useState(false)
  const [panelShow,  setPanelShow]  = useState(false)
  const [tableShow,  setTableShow]  = useState(false)
  const [askShow,    setAskShow]    = useState(false)
  const [askTyped,   setAskTyped]   = useState('')
  const [answerShow, setAnswerShow] = useState(false)

  const askTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  function at(t: number, fn: () => void) { timers.current.push(setTimeout(fn, t)) }
  function clear() { timers.current.forEach(clearTimeout); timers.current = [] }

  function typeAsk() {
    askTimers.current.forEach(clearTimeout); askTimers.current = []
    ASK_Q.split('').forEach((_, i) => {
      askTimers.current.push(setTimeout(() => setAskTyped(ASK_Q.slice(0, i + 1)), i * 35))
    })
  }

  const measureSel = useCallback(() => {
    const stage = stageRef.current, info = infoRef.current
    if (!stage || !info) return
    const sr = stage.getBoundingClientRect(), ir = info.getBoundingClientRect()
    const base: CSSProperties = { left: ir.left - sr.left - 6, top: ir.top - sr.top - 6, width: 0, height: 0 }
    setSnip(s => ({ ...s, selShow: true, selStyle: base }))
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setSnip(s => ({ ...s, selStyle: { ...base, width: ir.width + 12, height: ir.height + 12 } }))
    }))
  }, [])

  const play = useCallback((skipIdle = false) => {
    clear()
    // Reset all state
    setSnip(SNIP_INITIAL)
    setIdleShow(!skipIdle); setPageShow(skipIdle)
    setPopShow(false); setDropShow(false)
    setRuleOn(false); setPressing(false); setPanelShow(false); setTableShow(false)
    setAskShow(false); setAskTyped(''); setAnswerShow(false)
    askTimers.current.forEach(clearTimeout); askTimers.current = []

    // Offset: 0 when skipIdle (button click), 1500ms when auto-looping
    const o = skipIdle ? 0 : 1500
    if (!skipIdle) at(o, () => { setIdleShow(false); setPageShow(true) })
    at(o + 600,  () => setSnip(s => ({ ...s, dimShow: true, toolShow: true })))
    at(o + 1150, () => measureSel())
    at(o + 2250, () => setSnip(s => ({ ...s, dimShow: false, toolShow: false, selShow: false, scrimShow: true, flashKey: s.flashKey + 1 })))
    at(o + 2700, () => setPopShow(true))
    at(o + 3500, () => setDropShow(true))
    at(o + 4400, () => setDropShow(false))
    at(o + 4900, () => setRuleOn(true))
    at(o + 5700, () => setPressing(true))
    at(o + 6100, () => { setPressing(false); setPopShow(false); setPanelShow(true) })
    at(o + 7700, () => setTableShow(true))
    at(o + 9700, () => setTableShow(false))
    at(o + 10200, () => { setAskShow(true); typeAsk() })
    at(o + 11200, () => setAnswerShow(true))
    at(o + 12200, () => play())
  }, [measureSel]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIdleShow(false); setPageShow(true)
      setSnip(s => ({ ...s, scrimShow: true }))
      setPanelShow(true)
      return
    }
    play()
    return clear
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>

      {/* ── Idle hint ── */}
      {idleShow && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 13, textAlign: 'center', zIndex: 10 }}>
          <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ghost2)', textTransform: 'lowercase' }}>
            nothing here until you capture
          </div>
          <button
            onClick={() => play(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '10px 14px', border: '1px solid var(--hairline)', borderRadius: 12, background: 'var(--vapor)', backdropFilter: 'blur(12px)', fontSize: 12.5, color: 'var(--ghost)', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color .2s, background .2s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline2)'; (e.currentTarget as HTMLElement).style.background = 'var(--vapor2)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline)'; (e.currentTarget as HTMLElement).style.background = 'var(--vapor)' }}
            aria-label="Start capture demo"
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 10px var(--phosphor-glow)', display: 'inline-block', flexShrink: 0, animation: 'breathe 3s var(--ease) infinite' }} />
            take a screenshot&nbsp;&nbsp;
            <kbd style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, padding: '4px 6px', borderRadius: 6, background: 'rgba(255,255,255,.07)', border: '1px solid var(--hairline2)', borderBottomWidth: 2, color: 'var(--mist)' }}>⊞ Shift S</kbd>
          </button>
        </div>
      )}

      {/* ── Source: Aritzia product page (no Mac dots — generic browser chrome) ── */}
      {pageShow && (
        <div style={{ position: 'absolute', inset: 0, background: '#fff', color: '#1a1a1d', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 5 }}>
          <div style={{ height: 30, background: '#ececE7', display: 'flex', alignItems: 'center', gap: 7, padding: '0 11px', borderBottom: '1px solid #d8d8d2', flexShrink: 0 }}>
            <span style={{ color: '#aaa', fontSize: 13, lineHeight: 1, userSelect: 'none' }}>‹ ›</span>
            <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: '#666', background: '#fff', border: '1px solid #ddd', borderRadius: 7, padding: '3px 12px', flex: 1, maxWidth: '60%' }}>
              aritzia.com/effortless-short
            </span>
          </div>
          <div ref={infoRef} style={{ flex: 1, display: 'flex', gap: 22, padding: 24, alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ width: '44%', aspectRatio: '4/5', borderRadius: 12, background: 'linear-gradient(165deg,#eee,#dcdcd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              <ProductIcon type="shorts" color="#4f6740" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#888', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Aritzia</div>
              <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, marginTop: 6, letterSpacing: '-.02em' }}>Effortless Short</div>
              <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 'clamp(14px,2vw,18px)', marginTop: 10 }}>$48.00</div>
              <div style={{ display: 'flex', gap: 7, marginTop: 14 }}>
                {['#4f6740','#2a2a2a','#b9a06a'].map(c => <span key={c} style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid rgba(0,0,0,.12)', background: c }} />)}
              </div>
              <div style={{ marginTop: 18, display: 'inline-block', background: '#1a1a1d', color: '#fff', fontSize: 13, fontWeight: 500, padding: '11px 22px', borderRadius: 8 }}>Add to Bag</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Snip overlay ── */}
      {pageShow && <SnipOverlay {...snip} />}

      {/* ── Detection popup ── */}
      {popShow && (
        <div style={{ position: 'absolute', left: '5%', bottom: '8%', width: 'clamp(280px,60%,356px)', zIndex: 50, borderRadius: 15, background: 'linear-gradient(180deg,rgba(22,24,30,.94),rgba(12,13,18,.97))', backdropFilter: 'blur(24px)', border: '1px solid var(--hairline2)', boxShadow: '0 30px 80px -22px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.07)', animation: 'materialize .45s var(--ease) both' }}>
          <div style={{ display: 'flex', gap: 13, padding: '14px 14px 0' }}>
            <div style={{ width: 58, aspectRatio: '4/5', flexShrink: 0, borderRadius: 9, overflow: 'hidden', border: '1px solid var(--hairline2)', background: 'linear-gradient(165deg,#f6f6f2,#e6e6df)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ProductIcon type="shorts" color="#4f6740" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9.5, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--ghost)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block', flexShrink: 0 }} />
                Item detected
              </div>
              <div style={{ marginTop: 7, fontSize: 14, fontWeight: 600, color: 'var(--mist)' }}>Effortless Short</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: 'var(--ghost)' }}>Aritzia · $48.00 · aritzia.com</div>
            </div>
          </div>

          <div style={{ padding: '12px 14px 0' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ghost2)', marginBottom: 7 }}>Save to</div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#EAF0FF', background: 'rgba(174,194,255,.08)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 10, padding: '8px 13px' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block' }} />
                Wishlist
                <span style={{ color: 'var(--ghost)', fontSize: 10 }}>▾</span>
              </div>
              <div style={{ position: 'absolute', left: 0, bottom: 'calc(100% + 6px)', width: 170, background: 'rgba(18,20,26,.98)', border: '1px solid var(--hairline2)', borderRadius: 11, padding: 5, boxShadow: '0 20px 50px -16px rgba(0,0,0,.85)', opacity: dropShow ? 1 : 0, transform: dropShow ? 'none' : 'translateY(6px)', transition: '.2s var(--ease)', zIndex: 5, pointerEvents: 'none' }}>
                {['Wishlist', 'Shopping', 'Green shorts'].map((name, i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, fontSize: 12.5, color: i === 0 ? '#EAF0FF' : 'var(--ghost)', background: i === 0 ? 'rgba(255,255,255,.06)' : undefined }}>
                    <span>{name}</span>
                    <span style={{ color: 'var(--phosphor)', fontSize: 11, opacity: i === 0 ? 1 : 0 }}>✓</span>
                  </div>
                ))}
                <div style={{ padding: '8px 10px', borderTop: '1px solid var(--hairline)', marginTop: 3, fontSize: 12.5, color: 'var(--ghost2)' }}>+ New collection</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, fontSize: 11.5, color: ruleOn ? 'var(--mist)' : 'var(--ghost)', transition: 'color .25s' }}>
              <div style={{ width: 30, height: 17, borderRadius: 999, background: ruleOn ? 'rgba(174,194,255,.3)' : 'rgba(255,255,255,.12)', border: `1px solid ${ruleOn ? 'rgba(174,194,255,.5)' : 'var(--hairline2)'}`, position: 'relative', transition: '.25s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 1.5, width: 12, height: 12, borderRadius: '50%', background: ruleOn ? 'var(--phosphor)' : '#9aa0aa', left: ruleOn ? 15 : 2, boxShadow: ruleOn ? '0 0 8px var(--phosphor-glow)' : 'none', transition: '.25s' }} />
              </div>
              auto-file <strong style={{ color: '#EAF0FF', fontWeight: 500 }}>new Aritzia items</strong> here from now on
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px 14px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 14px', borderRadius: 11, fontSize: 13, fontWeight: 500, color: '#EAF0FF', background: 'linear-gradient(180deg,rgba(174,194,255,.2),rgba(174,194,255,.1))', border: '1px solid rgba(174,194,255,.45)', boxShadow: pressing ? '0 0 20px -2px var(--phosphor-glow)' : '0 5px 18px -8px var(--phosphor-glow)', transform: pressing ? 'scale(.96)' : 'none', transition: '.2s' }}>
              Save <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 6, padding: '2px 6px' }}>⏎</span>
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--ghost2)' }}>Dismiss</span>
          </div>
        </div>
      )}

      {/* ── Collection panel — mixed product grid ── */}
      {panelShow && (
        <div style={{ position: 'absolute', inset: 16, borderRadius: 13, border: '1px solid var(--hairline2)', background: 'linear-gradient(180deg,rgba(20,22,28,.96),rgba(12,13,18,.98))', backdropFilter: 'blur(20px)', zIndex: 55, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 80px -22px rgba(0,0,0,.85)', animation: 'rise .45s var(--ease) both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--hairline)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: '#7a6a9a', display: 'inline-block' }} />
              Wishlist
              <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: 'var(--ghost2)', fontWeight: 400 }}>10 captures</span>
            </div>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,.4)', border: '1px solid var(--hairline)', borderRadius: 9, padding: 3 }}>
              {[{ label: '⊞ images', active: !tableShow }, { label: '≣ text', active: tableShow }].map(seg => (
                <div key={seg.label} style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, padding: '6px 11px', borderRadius: 6, color: seg.active ? '#EAF0FF' : 'var(--ghost)', background: seg.active ? 'rgba(255,255,255,.085)' : 'transparent', transition: '.25s' }}>
                  {seg.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Grid — varied products */}
            <div style={{ position: 'absolute', inset: '14px 16px', opacity: tableShow ? 0 : 1, transition: '.4s var(--ease)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 9, alignContent: 'start' }}>
              {WARD.map((item, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 9, overflow: 'hidden', background: 'linear-gradient(165deg,#f8f7f4,#eae8e2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,.05)', outline: item.fresh ? '1.5px solid var(--phosphor)' : undefined, outlineOffset: item.fresh ? '-1.5px' : undefined, boxShadow: item.fresh ? '0 0 16px var(--phosphor-glow)' : undefined }}>
                  <ProductIcon type={item.type} color={item.color} />
                  <span style={{ position: 'absolute', top: 5, right: 6, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 6.5, color: '#333', background: 'rgba(255,255,255,.75)', borderRadius: 4, padding: '1px 4px' }}>{item.price.replace('.00','')}</span>
                  {item.fresh && <span style={{ position: 'absolute', top: 5, left: 5, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 6.5, color: '#0a0b0d', background: 'var(--phosphor)', borderRadius: 4, padding: '1px 4px' }}>new</span>}
                </div>
              ))}
            </div>

            {/* Table */}
            <div style={{ position: 'absolute', inset: '14px 16px', opacity: tableShow ? 1 : 0, transition: '.4s var(--ease)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .7fr', gap: 10, padding: '8px 6px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 8.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ghost2)' }}>
                <span>Item</span><span>Brand</span><span>Price</span>
              </div>
              {SORTED.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .7fr', gap: 10, padding: '7px 6px', borderBottom: '1px solid rgba(255,255,255,.05)', alignItems: 'center', background: item.fresh ? 'rgba(174,194,255,.08)' : undefined }}>
                  <span style={{ fontSize: 11.5, color: 'var(--mist)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ghost)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.brand}</span>
                  <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10.5, color: item.fresh ? 'var(--phosphor)' : 'var(--mist)' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ask beat */}
          {askShow && (
            <div style={{ padding: '10px 16px 14px', borderTop: '1px solid var(--hairline)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 11, background: 'rgba(0,0,0,.4)', border: '1px solid var(--hairline2)' }}>
                <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, color: 'var(--ghost2)' }}>ask</span>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--mist)', minHeight: 16 }}>
                  {askTyped}
                  {askTyped.length < ASK_Q.length && <span style={{ display: 'inline-block', width: 1.5, height: 13, background: 'var(--phosphor)', verticalAlign: -2, animation: 'blink 1s steps(1) infinite' }} />}
                </div>
              </div>
              {answerShow && (
                <div style={{ marginTop: 8, borderRadius: 11, padding: '10px 13px', background: 'linear-gradient(180deg,rgba(174,194,255,.10),rgba(174,194,255,.04))', border: '1px solid rgba(174,194,255,.3)', display: 'flex', alignItems: 'center', gap: 10, animation: 'ansin .35s var(--ease) both' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#EAF0FF' }}>{ASK_ANS}</div>
                    <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, color: 'var(--ghost)', marginTop: 2 }}>{ASK_SUB}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: 'var(--phosphor)', border: '1px solid rgba(174,194,255,.35)', borderRadius: 8, padding: '5px 9px', whiteSpace: 'nowrap' }}>open uniqlo.com ↗</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
