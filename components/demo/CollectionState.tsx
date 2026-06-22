'use client'

import { useState } from 'react'

interface Props { onBack: () => void }

const SHORTS_SVG = `<svg viewBox="0 0 100 100" fill="white"><path d="M22 26 H78 V44 L64 74 H53 L50 50 L47 74 H36 L22 44 Z"/></svg>`
const GLOBE_SVG  = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" style="width:8px;height:8px;opacity:.7"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"/></svg>`

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b | 0).toString(16).slice(1)
}

const fmt = (n: number) => '$' + n.toFixed(2)

const ITEMS = [
  { item: 'Cotton Easy Short',   brand: 'Uniqlo',          price: 19.90, dom: 'uniqlo.com',          g: '#52663a' },
  { item: 'Baggies 5"',          brand: 'Patagonia',       price: 59.00, dom: 'patagonia.com',        g: '#3a5a40' },
  { item: 'Dock Short',          brand: 'J.Crew',          price: 49.50, dom: 'jcrew.com',            g: '#5b6e4f' },
  { item: 'Linen-Blend Short',   brand: 'Abercrombie',     price: 40.00, dom: 'abercrombie.com',      g: '#44502f' },
  { item: 'Kore Short 7.5"',     brand: 'Vuori',           price: 68.00, dom: 'vuori.com',            g: '#566b3e' },
  { item: 'Built-In Flex',       brand: 'Old Navy',        price: 24.99, dom: 'oldnavy.com',          g: '#47593f' },
  { item: 'Pace Breaker',        brand: 'Lululemon',       price: 68.00, dom: 'lululemon.com',        g: '#6a7b53' },
  { item: 'Regular Fit Short',   brand: 'H&M',             price: 17.99, dom: 'hm.com',               g: '#728656' },
  { item: 'Performance Chino',   brand: 'Everlane',        price: 58.00, dom: 'everlane.com',         g: '#4a5a36' },
  { item: 'Hayden Short',        brand: 'Banana Republic', price: 54.50, dom: 'bananarepublic.com',   g: '#3f4f2f' },
  { item: 'Easy Short 9"',       brand: 'Gap',             price: 29.95, dom: 'gap.com',              g: '#5e6f4a' },
  { item: 'Camp Short',          brand: 'Madewell',        price: 52.00, dom: 'madewell.com',         g: '#525f3a' },
  { item: 'Effortless Short',    brand: 'Aritzia',         price: 48.00, dom: 'aritzia.com',          g: '#4f6740' },
  { item: 'Goodfellow Short',    brand: 'Target',          price: 20.00, dom: 'target.com',           g: '#606f48' },
]

const cheapest   = ITEMS.reduce((a, b) => b.price < a.price ? b : a)
const dearest    = ITEMS.reduce((a, b) => b.price > a.price ? b : a)
const avg        = ITEMS.reduce((s, i) => s + i.price, 0) / ITEMS.length
const under30    = ITEMS.filter(i => i.price < 30).sort((a, b) => a.price - b.price)

interface Answer { main: string; sub: string; open?: string }

function respond(q: string): Answer {
  const ql = q.toLowerCase()
  if (/cheap|least|lowest|min/.test(ql))   return { main: `${cheapest.brand} ${cheapest.item} — ${fmt(cheapest.price)}`, sub: `cheapest of 14 · range ${fmt(cheapest.price)}–${fmt(dearest.price)}`, open: cheapest.dom }
  if (/under.?30|below.?30|<30/.test(ql))  return { main: `${under30.length} under $30`, sub: under30.map(i => `${i.brand} ${fmt(i.price)}`).join('  ·  '), open: under30[0].dom }
  if (/avg|average|mean/.test(ql))          return { main: `Average ${fmt(avg)}`, sub: `across 14 · cheapest ${fmt(cheapest.price)} · priciest ${fmt(dearest.price)}` }
  if (/expensive|most|highest|max/.test(ql)) return { main: `${dearest.brand} ${dearest.item} — ${fmt(dearest.price)}`, sub: `most expensive of 14`, open: dearest.dom }
  if (/how many|count|total/.test(ql))      return { main: `14 captures`, sub: `range ${fmt(cheapest.price)}–${fmt(dearest.price)} · avg ${fmt(avg)}` }
  return { main: `${cheapest.brand} — ${fmt(cheapest.price)}`, sub: `best price · ask "under $30", "average", "most expensive"`, open: cheapest.dom }
}

const CHIP_DEFS = ['cheapest', 'under $30', 'average price', 'most expensive']

export function CollectionState({ onBack }: Props) {
  const [view, setView]       = useState<'images' | 'text'>('images')
  const [askVal, setAskVal]   = useState('')
  const [answer, setAnswer]   = useState<Answer | null>(null)

  function doAsk(q: string) {
    if (!q.trim()) return
    setAnswer(respond(q))
  }

  return (
    /* panel — centered by flex parent */
    <div
      className="relative flex flex-col anim-rise"
      style={{
        width: 'min(78%,720px)',
        height: 'min(82%,560px)',
        borderRadius: 18,
        border: '1px solid var(--hairline)',
        background: 'linear-gradient(180deg,rgba(22,24,30,.86),rgba(13,14,19,.88))',
        backdropFilter: 'blur(28px) saturate(1.1)',
        boxShadow: '0 36px 90px -28px rgba(0,0,0,.86), inset 0 1px 0 rgba(255,255,255,.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-[12px]" style={{ padding: '15px 17px 13px', borderBottom: '1px solid var(--hairline)', flexShrink: 0 }}>
        <div className="flex items-center gap-[11px] min-w-0">
          <button
            onClick={onBack}
            className="transition-all flex-none"
            style={{ color: 'var(--ghost2)', fontSize: 15, cursor: 'pointer', background: 'transparent', border: 'none' }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--mist)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--ghost2)')}
            aria-label="Back"
          >‹</button>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: '#5b7a4a', boxShadow: '0 0 10px rgba(120,170,90,.5)', display: 'inline-block', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Green shorts</div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)', marginTop: 2 }}>14 captures · $17.99–$68.00</div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-[7px] font-mono transition-all"
          style={{ fontSize: 10, color: 'var(--ghost)', padding: '6px 10px', border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer', background: 'transparent', whiteSpace: 'nowrap' }}
          onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline2)' }}
          onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ghost)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline)' }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block' }} />
          auto-file: on
        </button>
      </div>

      {/* Tabs row */}
      <div className="flex items-center justify-between gap-[10px]" style={{ padding: '11px 17px 0', flexShrink: 0 }}>
        <div
          className="flex font-mono"
          style={{ background: 'rgba(0,0,0,.32)', border: '1px solid var(--hairline)', borderRadius: 11, padding: 3 }}
          role="group" aria-label="view"
        >
          {(['images', 'text'] as const).map(v => (
            <button
              key={v}
              data-view={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              style={{
                border: 'none', cursor: 'pointer',
                fontSize: 11, letterSpacing: '.04em',
                padding: '7px 14px', borderRadius: 8,
                transition: '.2s',
                background: view === v ? 'var(--vapor2)' : 'transparent',
                color: view === v ? '#EAF0FF' : 'var(--ghost)',
              }}
            >
              {v === 'images' ? '⊞ images' : '≣ text'}
            </button>
          ))}
        </div>
        <span className="font-mono" style={{ fontSize: 10, color: 'var(--ghost2)' }}>
          {view === 'images' ? '14 items' : 'sorted by price ↑'}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 8px' }}>
        {view === 'images' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(108px,1fr))', gap: 11 }}>
            {ITEMS.map(item => {
              const isCheap = item === cheapest
              return (
                <div
                  key={item.item}
                  style={{
                    position: 'relative',
                    aspectRatio: '4/5',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid var(--hairline)',
                    boxShadow: '0 12px 28px -16px rgba(0,0,0,.7)',
                    cursor: 'pointer',
                    background: `linear-gradient(155deg, ${item.g}, ${shade(item.g, -18)})`,
                    outline: isCheap ? '1.5px solid var(--phosphor)' : undefined,
                    outlineOffset: isCheap ? '-1.5px' : undefined,
                  }}
                >
                  {isCheap && (
                    <span className="font-mono" style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, fontSize: 8.5, letterSpacing: '.06em', color: '#0a0b0d', background: 'var(--phosphor)', borderRadius: 6, padding: '3px 6px', boxShadow: '0 0 14px var(--phosphor-glow)' }}>
                      cheapest
                    </span>
                  )}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: .22 }}
                    dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 100" fill="white" style="width:54%;height:54%"><path d="M22 26 H78 V44 L64 74 H53 L50 50 L47 74 H36 L22 44 Z"/></svg>` }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.05) 40%,rgba(0,0,0,.66))' }} />
                  <span style={{ position: 'absolute', top: 8, right: 8, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10.5, fontWeight: 500, color: '#fff', background: 'rgba(0,0,0,.42)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 7, padding: '3px 6px', zIndex: 2 }}>
                    {fmt(item.price)}
                  </span>
                  <span style={{ position: 'absolute', left: 9, bottom: 18, fontSize: 11.5, fontWeight: 500, color: '#fff', zIndex: 2 }}>{item.brand}</span>
                  <span className="font-mono flex items-center gap-[4px]" style={{ position: 'absolute', left: 9, bottom: 6, fontSize: 8.5, color: 'rgba(255,255,255,.62)', zIndex: 2 }}
                    dangerouslySetInnerHTML={{ __html: `${GLOBE_SVG}${item.dom}` }}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .7fr 1fr', gap: 10, alignItems: 'center', padding: '9px 8px', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ghost2)', borderBottom: '1px solid var(--hairline)' }}>
              <span>Item</span><span>Brand</span><span style={{ color: 'var(--phosphor)' }}>Price ↑</span><span>Source</span>
            </div>
            {[...ITEMS].sort((a, b) => a.price - b.price).map(item => {
              const isCheap = item === cheapest
              return (
                <div
                  key={item.item}
                  style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .7fr 1fr', gap: 10, alignItems: 'center', padding: '9px 8px', borderBottom: '1px solid rgba(255,255,255,.05)', background: isCheap ? 'rgba(174,194,255,.07)' : undefined, transition: '.15s', cursor: 'default' }}
                  onMouseOver={e => { if (!isCheap) (e.currentTarget as HTMLElement).style.background = 'var(--vapor)' }}
                  onMouseOut={e => { if (!isCheap) (e.currentTarget as HTMLElement).style.background = '' }}
                >
                  <span style={{ fontSize: 13, color: 'var(--mist)', fontWeight: 500 }}>
                    {item.item}{isCheap && <span className="font-mono" style={{ marginLeft: 7, color: 'var(--phosphor)', fontSize: 10, letterSpacing: '.04em' }}>· cheapest</span>}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--ghost)' }}>{item.brand}</span>
                  <span className="font-mono" style={{ fontSize: 12.5, color: isCheap ? '#EAF0FF' : 'var(--mist)' }}>{fmt(item.price)}</span>
                  <button className="font-mono flex items-center gap-[5px]" style={{ fontSize: 11, color: 'var(--ghost2)', cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left' }}
                    onMouseOver={e => (e.currentTarget.style.color = 'var(--phosphor)')}
                    onMouseOut={e => (e.currentTarget.style.color = 'var(--ghost2)')}
                    dangerouslySetInnerHTML={{ __html: `${GLOBE_SVG}${item.dom}` }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Answer */}
      {answer && (
        <div style={{ padding: '0 16px', overflow: 'hidden' }}>
          <div
            className="flex items-center gap-[13px] anim-ansin"
            style={{ margin: '6px 0 0', padding: '12px 14px', borderRadius: 13, background: 'linear-gradient(180deg,rgba(174,194,255,.10),rgba(174,194,255,.04))', border: '1px solid rgba(174,194,255,.30)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.05)' }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#EAF0FF', letterSpacing: '-.01em' }}>{answer.main}</div>
              <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--ghost)', marginTop: 3 }}>{answer.sub}</div>
            </div>
            {answer.open && (
              <button
                onClick={() => setAnswer(null)}
                className="font-mono"
                style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--phosphor)', border: '1px solid rgba(174,194,255,.35)', borderRadius: 9, padding: '7px 11px', cursor: 'pointer', background: 'transparent', whiteSpace: 'nowrap', transition: '.2s' }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.background = 'rgba(174,194,255,.12)'}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                open {answer.open} ↗
              </button>
            )}
          </div>
        </div>
      )}

      {/* Ask bar */}
      <div style={{ padding: '11px 16px 15px', borderTop: '1px solid var(--hairline)', flexShrink: 0 }}>
        <div className="flex gap-[7px] flex-wrap" style={{ marginBottom: 9 }}>
          {CHIP_DEFS.map(chip => (
            <button
              key={chip}
              className="font-mono transition-all"
              style={{ fontSize: 10.5, color: 'var(--ghost)', background: 'var(--vapor)', border: '1px solid var(--hairline)', borderRadius: 999, padding: '6px 11px', cursor: 'pointer' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline2)'; (e.currentTarget as HTMLElement).style.background = 'var(--vapor2)' }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ghost)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline)'; (e.currentTarget as HTMLElement).style.background = 'var(--vapor)' }}
              onClick={() => { setAskVal(chip); doAsk(chip) }}
            >
              {chip}
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-[11px]"
          style={{ padding: '11px 13px', borderRadius: 13, background: 'rgba(0,0,0,.34)', border: '1px solid var(--hairline2)', transition: 'border-color .2s, box-shadow .2s' }}
          onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(174,194,255,.45)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
          onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline2)'; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
        >
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--ghost2)' }}>ask</span>
          <input
            type="text"
            value={askVal}
            onChange={e => { setAskVal(e.target.value); if (!e.target.value) setAnswer(null) }}
            onKeyDown={e => { if (e.key === 'Enter') doAsk(askVal) }}
            placeholder="Ask Green shorts…"
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: 13.5, color: 'var(--mist)' }}
            aria-label="Ask about this collection"
          />
          <button
            onClick={() => doAsk(askVal)}
            className="inline-flex items-center justify-center font-mono transition-all"
            style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', background: 'linear-gradient(180deg,rgba(174,194,255,.22),rgba(174,194,255,.10))', border: '1px solid rgba(174,194,255,.4)', color: '#EAF0FF', fontSize: 13 }}
            onMouseOver={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px -2px var(--phosphor-glow)'}
            onMouseOut={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
            aria-label="Submit question"
          >⏎</button>
        </div>
      </div>
    </div>
  )
}
