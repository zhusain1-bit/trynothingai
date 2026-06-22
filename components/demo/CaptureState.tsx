'use client'

import { useState, useRef, useCallback, useEffect, type CSSProperties } from 'react'
import { SnipOverlay, SNIP_INITIAL, type SnipState } from '@/components/features/SnipOverlay'

interface Props { onSave: () => void }

const CAPTURES = [
  {
    type: 'Item', cap: 'aritzia.com', title: 'Effortless Short', meta: 'Aritzia · $48.00 · aritzia.com',
    suggested: 'Green shorts', chips: ['Green shorts', 'Shopping', 'Wishlist'],
    ctxPlaceholder: 'size M · under $40 · for the trip',
    url: 'aritzia.com/effortless-short',
  },
  {
    type: 'Event', cap: 'Beach House', title: 'Beach House — live', meta: 'Fri Mar 14 · 8:00 PM · Brooklyn Steel',
    suggested: 'Calendar', chips: ['Calendar', 'Concerts', 'To-go list'],
    ctxPlaceholder: 'remind me 2 days before · going with Sam',
    url: 'dice.fm/event/beach-house',
  },
  {
    type: 'Receipt', cap: 'Uniqlo', title: 'Uniqlo order', meta: '$86.40 · Mar 9 · 3 items',
    suggested: 'Receipts', chips: ['Receipts', 'Taxes 2026', 'Returns'],
    ctxPlaceholder: 'return window ends Apr 9 · work expense',
    url: 'uniqlo.com/en/order/confirm',
  },
]

type SubPhase = 'idle' | 'page' | 'snipping' | 'captured' | 'popup'

function AritziaPage({ infoRef }: { infoRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', color: '#1a1a1d', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 5 }}>
      <div style={{ height: 26, background: '#ececE7', display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px', borderBottom: '1px solid #d8d8d2', flexShrink: 0 }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: 6, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, color: '#666', background: '#fff', border: '1px solid #ddd', borderRadius: 5, padding: '2px 9px', flex: 1, maxWidth: '55%' }}>aritzia.com/effortless-short</span>
      </div>
      <div ref={infoRef} style={{ flex: 1, display: 'flex', gap: 14, padding: '14px 16px', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ width: '38%', aspectRatio: '4/5', borderRadius: 9, background: 'linear-gradient(165deg,#eee,#dcdcd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          <svg viewBox="0 0 120 134" style={{ width: '56%', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.18))' }}>
            <path d="M18 36 H102 L98 66 L86 126 H64 L60 76 L56 126 H34 L22 66 Z" fill="#4f6740" />
            <rect x="18" y="30" width="84" height="11" rx="2.5" fill="#2b3a1a" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#888', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600 }}>Aritzia</div>
          <div style={{ fontSize: 'clamp(14px,2.5vw,19px)', fontWeight: 700, marginTop: 4, letterSpacing: '-.02em' }}>Effortless Short</div>
          <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 'clamp(12px,2vw,15px)', marginTop: 7 }}>$48.00</div>
          <div style={{ display: 'flex', gap: 5, marginTop: 9 }}>
            {['#4f6740','#2a2a2a','#b9a06a'].map(c => <span key={c} style={{ width: 13, height: 13, borderRadius: '50%', border: '1px solid rgba(0,0,0,.12)', background: c }} />)}
          </div>
          <div style={{ marginTop: 11, display: 'inline-block', background: '#1a1a1d', color: '#fff', fontSize: 11, fontWeight: 500, padding: '7px 14px', borderRadius: 6 }}>Add to Bag</div>
        </div>
      </div>
    </div>
  )
}

export function CaptureState({ onSave }: Props) {
  const [ci, setCi]             = useState(0)
  const [sub, setSub]           = useState<SubPhase>('idle')
  const [selected, setSelected]  = useState('')
  const [ctxOpen, setCtxOpen]    = useState(false)
  const [ctxVal, setCtxVal]      = useState('')
  const [toastText, setToastText] = useState('')
  const [toastVis, setToastVis]  = useState(false)
  const [snip, setSnip]          = useState<SnipState>(SNIP_INITIAL)

  const stageRef = useRef<HTMLDivElement>(null)
  const infoRef  = useRef<HTMLDivElement>(null)

  const c = CAPTURES[ci]

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

  // snip sequence after page appears
  useEffect(() => {
    if (sub !== 'page') return
    const t1 = setTimeout(() => {
      setSub('snipping')
      setSnip(s => ({ ...s, dimShow: true, toolShow: true }))
    }, 700)
    const t2 = setTimeout(() => { measureSel() }, 1250)
    const t3 = setTimeout(() => {
      setSnip(s => ({ ...s, dimShow: false, toolShow: false, selShow: false, scrimShow: true, flashKey: s.flashKey + 1 }))
      setSub('captured')
    }, 2350)
    const t4 = setTimeout(() => {
      setSub('popup')
      setSelected(c.suggested)
    }, 2800)
    return () => { [t1,t2,t3,t4].forEach(clearTimeout) }
  }, [sub, c.suggested, measureSel])

  function triggerCapture() { setSub('page') }

  function resetToIdle() {
    setSub('idle'); setSelected(''); setCtxOpen(false); setCtxVal('')
    setSnip(SNIP_INITIAL)
  }

  function save() {
    const dest = selected || c.suggested
    setToastText(`Saved to ${dest}`)
    setToastVis(true)
    resetToIdle()
    setTimeout(() => { setToastVis(false); onSave() }, 1800)
  }

  function nextCapture() {
    setCi(i => (i + 1) % CAPTURES.length)
    setSelected(''); setCtxOpen(false); setCtxVal('')
    setSnip(SNIP_INITIAL)
    setSub('idle')
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') resetToIdle()
      if (e.key === 'Enter' && sub === 'popup') save()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>

      {/* ── Idle hint ── */}
      {sub === 'idle' && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 13, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ghost2)', textTransform: 'lowercase' }}>
            nothing here until you capture
          </div>
          <button
            onClick={triggerCapture}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '10px 14px', border: '1px solid var(--hairline)', borderRadius: 12, background: 'var(--vapor)', backdropFilter: 'blur(12px)', fontSize: 12.5, color: 'var(--ghost)', cursor: 'pointer', transition: 'all .25s var(--ease)' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline2)'; (e.currentTarget as HTMLElement).style.background = 'var(--vapor2)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ghost)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline)'; (e.currentTarget as HTMLElement).style.background = 'var(--vapor)' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 10px var(--phosphor-glow)', display: 'inline-block', flexShrink: 0, animation: 'breathe 3s var(--ease) infinite' }} />
            take a screenshot &nbsp;
            <kbd style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, padding: '4px 6px', borderRadius: 6, background: 'rgba(255,255,255,.07)', border: '1px solid var(--hairline2)', borderBottomWidth: 2, color: 'var(--mist)' }}>⌘⇧S</kbd>
          </button>
        </div>
      )}

      {/* ── Source page (Aritzia) ── */}
      {(sub === 'page' || sub === 'snipping' || sub === 'captured' || sub === 'popup') && (
        <AritziaPage infoRef={infoRef} />
      )}

      {/* ── Snip overlay ── */}
      {(sub === 'page' || sub === 'snipping' || sub === 'captured' || sub === 'popup') && (
        <SnipOverlay {...snip} />
      )}

      {/* ── Detection popup (over dimmed page) ── */}
      {sub === 'popup' && (
        <div
          style={{
            position: 'absolute', right: '5%', bottom: '8%', zIndex: 50,
            width: 'clamp(240px,44%,310px)',
            borderRadius: 18,
            border: '1px solid var(--hairline)',
            background: 'linear-gradient(180deg,rgba(22,24,30,.96),rgba(13,14,19,.98))',
            backdropFilter: 'blur(28px) saturate(1.1)',
            boxShadow: '0 30px 80px -22px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.07)',
            animation: 'materialize .4s var(--ease) both',
          }}
          role="dialog" aria-label="Save screenshot"
        >
          {/* Eyebrow */}
          <div style={{ padding: '13px 14px 0', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ghost)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block', flexShrink: 0 }} />
            {c.type} detected
          </div>
          <div style={{ padding: '8px 14px 0', fontSize: 14, fontWeight: 600, color: 'var(--mist)' }}>{c.title}</div>
          <div style={{ padding: '3px 14px 0', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, color: 'var(--ghost)' }}>{c.meta}</div>

          {/* Save to */}
          <div style={{ padding: '12px 14px 0', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ghost2)', marginBottom: 6 }}>Save to</div>
          <div style={{ padding: '0 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {c.chips.map(name => {
              const sel = name === selected
              return (
                <button
                  key={name}
                  onClick={() => setSelected(name)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, cursor: 'pointer', color: sel ? '#EAF0FF' : 'var(--ghost)', background: sel ? 'rgba(174,194,255,.08)' : 'var(--vapor)', border: sel ? '1px solid rgba(174,194,255,.45)' : '1px solid var(--hairline)', borderRadius: 999, padding: '6px 11px' }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: '50%', border: sel ? '1.5px solid var(--phosphor)' : '1.5px solid var(--ghost2)', background: sel ? 'var(--phosphor)' : 'transparent', boxShadow: sel ? '0 0 8px var(--phosphor-glow)' : undefined, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: sel ? '#0a0b0d' : 'transparent' }}>✓</span>
                  {name}
                </button>
              )
            })}
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, cursor: 'pointer', color: 'var(--ghost2)', background: 'var(--vapor)', border: '1px dashed var(--hairline)', borderRadius: 999, padding: '6px 11px' }}>+ new</button>
          </div>

          {/* Context */}
          <div style={{ padding: '10px 14px 0' }}>
            {!ctxOpen ? (
              <button onClick={() => setCtxOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--ghost2)', background: 'transparent', border: 'none', fontFamily: 'inherit', cursor: 'pointer', padding: '2px 0' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--mist)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--ghost2)')}>
                <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 14, lineHeight: 1 }}>+</span> add context
              </button>
            ) : (
              <div style={{ animation: 'ansin .3s var(--ease) both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 11, padding: '8px 10px', background: 'rgba(0,0,0,.34)', border: '1px solid var(--hairline2)' }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, color: 'var(--ghost2)' }}>note</span>
                  <input autoFocus type="text" value={ctxVal} onChange={e => setCtxVal(e.target.value)} placeholder={c.ctxPlaceholder} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: 'var(--mist)' }} aria-label="Add context" />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px 13px' }}>
            <button onClick={save} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 14px', borderRadius: 11, fontSize: 13, fontWeight: 500, color: '#EAF0FF', background: 'linear-gradient(180deg,rgba(174,194,255,.2),rgba(174,194,255,.1))', border: '1px solid rgba(174,194,255,.45)', boxShadow: '0 6px 22px -8px var(--phosphor-glow)', cursor: 'pointer' }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px -2px var(--phosphor-glow),0 6px 26px -6px var(--phosphor-glow)'}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 22px -8px var(--phosphor-glow)'}>
              Save <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 6, padding: '2px 6px', color: '#DCE6FF' }}>⏎</span>
            </button>
            <button onClick={resetToIdle} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ghost2)', fontSize: 12.5, fontFamily: 'inherit', padding: '8px 4px' }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--mist)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--ghost2)')}>Dismiss</button>
            <span style={{ flex: 1 }} />
            <button onClick={nextCapture} style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10.5, color: 'var(--ghost2)', cursor: 'pointer', background: 'transparent', border: 'none' }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--ghost)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--ghost2)')}>↻ next</button>
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={{ position: 'absolute', left: '50%', bottom: '7%', transform: `translateX(-50%) translateY(${toastVis ? 0 : 10}px)`, zIndex: 60, opacity: toastVis ? 1 : 0, pointerEvents: toastVis ? 'auto' : 'none', padding: '11px 16px', borderRadius: 13, background: 'rgba(16,18,24,.92)', backdropFilter: 'blur(20px)', border: '1px solid var(--hairline2)', fontSize: 12.5, color: 'var(--mist)', boxShadow: '0 20px 50px -18px rgba(0,0,0,.8)', whiteSpace: 'nowrap', transition: '.4s var(--ease)', display: 'flex', alignItems: 'center', gap: 11 }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--phosphor)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--phosphor)', fontSize: 9, boxShadow: '0 0 10px var(--phosphor-glow)', flexShrink: 0 }}>✓</span>
        {toastText}
        <span style={{ color: 'var(--ghost)', fontSize: 11 }}>⌘Z undo</span>
      </div>
    </div>
  )
}
