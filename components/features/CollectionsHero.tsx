'use client'

import { useState, useRef, useCallback, type CSSProperties } from 'react'
import { SnipOverlay, SNIP_INITIAL, type SnipState } from './SnipOverlay'
import { useAnimationLoop } from './useAnimationLoop'
import { useInView } from './useInView'

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b | 0).toString(16).slice(1)
}

function ShortsSVG({ color }: { color: string }) {
  const d = shade(color, -34)
  return (
    <svg className="shortsvg" viewBox="0 0 120 134" style={{ width: '56%', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.18))' }}>
      <path d={`M18 36 H102 L98 66 L86 126 H64 L60 76 L56 126 H34 L22 66 Z`} fill={color} />
      <rect x="18" y="30" width="84" height="11" rx="2.5" fill={d} />
      <line x1="60" y1="41" x2="60" y2="76" stroke={d} strokeWidth="1.2" opacity=".5" />
    </svg>
  )
}

const WARD = [
  { c: '#4f6740', b: 'Aritzia', i: 'Effortless Short', p: '$48.00', fr: true },
  { c: '#6f7d3e', b: 'H&M',     i: 'Regular Short',   p: '$17.99' },
  { c: '#8a976a', b: 'Uniqlo',  i: 'Easy Short',      p: '$19.90' },
  { c: '#586b3a', b: 'Target',  i: 'Goodfellow',      p: '$20.00' },
  { c: '#5e6f4a', b: 'Gap',     i: 'Easy Short',      p: '$29.95' },
  { c: '#3f5a3a', b: 'Patagonia',i:'Baggies 5"',      p: '$59.00' },
  { c: '#4a5a36', b: 'Everlane',i: 'Performance',     p: '$58.00' },
  { c: '#7a8456', b: 'J.Crew',  i: 'Dock Short',      p: '$49.50' },
  { c: '#525f3a', b: 'Madewell',i: 'Camp Short',      p: '$52.00' },
  { c: '#6a7b53', b: 'Lulu',    i: 'Pace',            p: '$68.00' },
]
const SORTED = [...WARD].sort((a, b) => parseFloat(a.p.slice(1)) - parseFloat(b.p.slice(1)))

export function CollectionsHero() {
  const { ref: containerRef, inView } = useInView()
  const stageRef = useRef<HTMLDivElement>(null)
  const infoRef  = useRef<HTMLDivElement>(null)

  const [snip, setSnip]         = useState<SnipState>(SNIP_INITIAL)
  const [popShow, setPopShow]   = useState(false)
  const [pressing, setPressing]  = useState(false)
  const [dropShow, setDropShow]  = useState(false)
  const [ruleOn, setRuleOn]     = useState(false)
  const [panelShow, setPanelShow] = useState(false)
  const [tableShow, setTableShow] = useState(false)
  const [imgActive, setImgActive] = useState(true)

  function reset() {
    setSnip(SNIP_INITIAL)
    setPopShow(false); setPressing(false); setDropShow(false); setRuleOn(false)
    setPanelShow(false); setTableShow(false); setImgActive(true)
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

  useAnimationLoop([
    { ms: 700,  action: () => setSnip(s => ({ ...s, dimShow: true, toolShow: true })) },
    { ms: 1250, action: measureSel },
    { ms: 2350, action: () => setSnip(s => ({ ...s, dimShow: false, toolShow: false, selShow: false, scrimShow: true, flashKey: s.flashKey + 1 })) },
    { ms: 2800, action: () => setPopShow(true) },
    { ms: 3600, action: () => setDropShow(true) },
    { ms: 4500, action: () => setDropShow(false) },
    { ms: 5000, action: () => setRuleOn(true) },
    { ms: 5800, action: () => setPressing(true) },
    { ms: 6200, action: () => { setPressing(false); setPopShow(false); setPanelShow(true) } },
    { ms: 7800, action: () => { setTableShow(true); setImgActive(false) } },
    { ms: 9800, action: () => { setTableShow(false); setImgActive(true) } },
  ], 12400, reset, inView)

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ overflow: 'hidden' }}>
      <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>

        {/* ── Source: Aritzia product page ── */}
        <div style={{ position: 'absolute', inset: 0, background: '#fff', color: '#1a1a1d', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 5 }}>
          {/* Browser chrome */}
          <div style={{ height: 28, background: '#ececE7', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', borderBottom: '1px solid #d8d8d2', flexShrink: 0 }}>
            <span style={{ color: '#aaa', fontSize: 13, lineHeight: 1, userSelect: 'none' }}>‹ ›</span>
            <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9.5, color: '#666', background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: '3px 11px', flex: 1, maxWidth: '58%' }}>aritzia.com/effortless-short</span>
          </div>

          {/* Product page — infozone */}
          <div ref={infoRef} style={{ flex: 1, display: 'flex', gap: 18, padding: 20, alignItems: 'center' }}>
            <div style={{ width: '42%', aspectRatio: '4/5', borderRadius: 11, background: 'linear-gradient(165deg,#eee,#dcdcd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShortsSVG color="#4f6740" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Aritzia</div>
              <div style={{ fontSize: 21, fontWeight: 700, marginTop: 5, letterSpacing: '-.02em' }}>Effortless Short</div>
              <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 16, marginTop: 9 }}>$48.00</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 11 }}>
                {['#4f6740','#2a2a2a','#b9a06a'].map(c => <span key={c} style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid rgba(0,0,0,.12)', background: c }} />)}
              </div>
              <div style={{ marginTop: 15, display: 'inline-block', background: '#1a1a1d', color: '#fff', fontSize: 12, fontWeight: 500, padding: '9px 18px', borderRadius: 7 }}>Add to Bag</div>
            </div>
          </div>
        </div>

        {/* Snip overlay */}
        <SnipOverlay {...snip} />

        {/* Detection popup */}
        <div
          style={{
            position: 'absolute', left: '5%', bottom: '7%', zIndex: 50,
            width: 'clamp(260px,56%,330px)',
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
            <div style={{ flexShrink: 0, width: 50, aspectRatio: '4/5', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline2)', background: 'linear-gradient(165deg,#f6f6f2,#e6e6df)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShortsSVG color="#4f6740" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--ghost)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block', flexShrink: 0 }} />
                Item detected
              </div>
              <div style={{ marginTop: 7, fontSize: 13, fontWeight: 600, color: 'var(--mist)' }}>Effortless Short</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: 'var(--ghost)', lineHeight: 1.5 }}>Aritzia · $48.00 · aritzia.com</div>
            </div>
          </div>

          {/* Collection selector */}
          <div style={{ padding: '10px 13px 0' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 8.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ghost2)', marginBottom: 6 }}>Save to</div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#EAF0FF', background: 'rgba(174,194,255,.08)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 9, padding: '7px 12px' }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block' }} />
                Green shorts
                <span style={{ color: 'var(--ghost)', fontSize: 9 }}>▾</span>
              </div>
              {/* Dropdown */}
              <div
                style={{
                  position: 'absolute', left: 0, bottom: 'calc(100% + 6px)', width: 160,
                  background: 'rgba(18,20,26,.99)', border: '1px solid var(--hairline2)', borderRadius: 10, padding: 5,
                  boxShadow: '0 18px 46px -14px rgba(0,0,0,.85)',
                  opacity: dropShow ? 1 : 0,
                  transform: dropShow ? 'none' : 'translateY(6px)',
                  transition: '.2s var(--ease)', zIndex: 6,
                  pointerEvents: 'none',
                }}
              >
                {['Green shorts', 'Shopping', 'Wishlist'].map((name, i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', borderRadius: 7, fontSize: 12, color: i === 0 ? '#EAF0FF' : 'var(--ghost)' }}>
                    <span>{name}</span>
                    <span style={{ color: 'var(--phosphor)', opacity: i === 0 ? 1 : 0, fontSize: 10 }}>✓</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', padding: '7px 9px', borderRadius: 7, fontSize: 12, color: 'var(--ghost2)', borderTop: '1px solid var(--hairline)', marginTop: 3, paddingTop: 8 }}>
                  + New collection
                </div>
              </div>
            </div>

            {/* Auto-file rule */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11, fontSize: 11, color: ruleOn ? 'var(--mist)' : 'var(--ghost)' }}>
              <div style={{
                width: 28, height: 16, borderRadius: 999,
                background: ruleOn ? 'rgba(174,194,255,.3)' : 'rgba(255,255,255,.12)',
                border: `1px solid ${ruleOn ? 'rgba(174,194,255,.5)' : 'var(--hairline2)'}`,
                position: 'relative', transition: '.25s', flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute', top: 1, width: 11, height: 11, borderRadius: '50%',
                  background: ruleOn ? 'var(--phosphor)' : '#9aa0aa',
                  left: ruleOn ? 14 : 2,
                  boxShadow: ruleOn ? '0 0 8px var(--phosphor-glow)' : 'none',
                  transition: '.25s',
                }} />
              </div>
              auto-file <strong style={{ color: '#EAF0FF', fontWeight: 500 }}>green shorts</strong> here from now on
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px 13px' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 13px', borderRadius: 10, fontSize: 12.5, fontWeight: 500,
                color: '#EAF0FF',
                background: 'linear-gradient(180deg,rgba(174,194,255,.2),rgba(174,194,255,.1))',
                border: '1px solid rgba(174,194,255,.45)',
                boxShadow: pressing ? '0 0 20px -2px var(--phosphor-glow)' : '0 5px 18px -8px var(--phosphor-glow)',
                transform: pressing ? 'scale(.96)' : 'none', transition: '.2s',
              }}
            >
              Save <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 5, padding: '1px 5px' }}>⏎</span>
            </span>
            <span style={{ fontSize: 12, color: 'var(--ghost2)' }}>Dismiss</span>
          </div>
        </div>

        {/* Collection panel */}
        <div
          style={{
            position: 'absolute', inset: 14, borderRadius: 12,
            border: '1px solid var(--hairline2)',
            background: 'linear-gradient(180deg,rgba(20,22,28,.97),rgba(12,13,18,.99))',
            backdropFilter: 'blur(18px)', zIndex: 55,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            opacity: panelShow ? 1 : 0,
            transform: panelShow ? 'none' : 'translateY(12px)',
            transition: '.45s var(--ease)',
          }}
        >
          {/* Panel header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--hairline)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#5b7a4a', display: 'inline-block' }} />
              Green shorts
              <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, color: 'var(--ghost2)', fontWeight: 400 }}>15 captures</span>
            </div>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,.4)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 3 }}>
              {[{label:'⊞ images', active: imgActive}, {label:'≣ text', active: !imgActive}].map(seg => (
                <div key={seg.label} style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, padding: '5px 10px', borderRadius: 6, color: seg.active ? '#EAF0FF' : 'var(--ghost)', background: seg.active ? 'rgba(255,255,255,.085)' : 'transparent', transition: '.25s' }}>
                  {seg.label}
                </div>
              ))}
            </div>
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Grid view */}
            <div style={{ position: 'absolute', inset: '12px 14px', opacity: tableShow ? 0 : 1, transition: '.4s var(--ease)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, alignContent: 'start' }}>
              {WARD.map((item, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(165deg,#f6f6f2,#e6e6df)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,.05)', outline: item.fr ? '1.5px solid var(--phosphor)' : undefined, outlineOffset: item.fr ? '-1.5px' : undefined, boxShadow: item.fr ? '0 0 14px var(--phosphor-glow)' : undefined }}>
                  <ShortsSVG color={item.c} />
                  <span style={{ position: 'absolute', top: 4, right: 5, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 6.5, color: '#222', background: 'rgba(255,255,255,.7)', borderRadius: 3, padding: '1px 3px' }}>{item.p.replace('.00','')}</span>
                  {item.fr && <span style={{ position: 'absolute', top: 4, left: 4, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 6, color: '#0a0b0d', background: 'var(--phosphor)', borderRadius: 3, padding: '1px 3px' }}>new</span>}
                </div>
              ))}
            </div>

            {/* Table view */}
            <div style={{ position: 'absolute', inset: '12px 14px', opacity: tableShow ? 1 : 0, transition: '.4s var(--ease)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .7fr', gap: 9, padding: '7px 5px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ghost2)' }}>
                <span>Item</span><span>Brand</span><span>Price</span>
              </div>
              {SORTED.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .7fr', gap: 9, padding: '7px 5px', borderBottom: '1px solid rgba(255,255,255,.05)', alignItems: 'center', background: item.fr ? 'rgba(174,194,255,.08)' : item.p === '$17.99' ? 'rgba(174,194,255,.04)' : undefined }}>
                  <span style={{ fontSize: 11, color: 'var(--mist)' }}>{item.i}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--ghost)' }}>{item.b}</span>
                  <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: (item.fr || item.p === '$17.99') ? 'var(--phosphor)' : 'var(--mist)' }}>{item.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
