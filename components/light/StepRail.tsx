'use client'

import { useEffect, useRef, useState } from 'react'

const ITEMS = [
  { id: 'setup', label: 'setup' },
  { id: 'capture', label: 'capture' },
  { id: 'extract', label: 'extraction' },
  { id: 'table', label: 'the table' },
]

// Tracks which feature block is centered in the viewport (rootMargin
// -45% top/bottom shrinks the observed band to a thin strip through the
// vertical center) and slides a single accent bar to match, rather than
// toggling discrete active/inactive classes per item.
export function StepRail() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const sections = ITEMS.map(i => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el)
    if (sections.length === 0) return
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!activeId || !railRef.current) return
    const el = itemRefs.current[activeId]
    if (!el) return
    const railRect = railRef.current.getBoundingClientRect()
    const itemRect = el.getBoundingClientRect()
    setIndicator({ top: itemRect.top - railRect.top, height: itemRect.height })
  }, [activeId])

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={railRef} className="hidden lg:block" style={{ position: 'sticky', top: '6rem', alignSelf: 'start' }}>
      <div style={{ position: 'relative', paddingLeft: 16 }}>
        <div
          aria-hidden="true"
          className="rail-indicator"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 3,
            borderRadius: 2,
            background: '#C2410C',
            height: indicator ? indicator.height : 0,
            transform: `translateY(${indicator ? indicator.top : 0}px)`,
            opacity: indicator ? 1 : 0,
          }}
        />
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ITEMS.map(item => (
            <li key={item.id}>
              <button
                ref={el => { itemRefs.current[item.id] = el }}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rail-item"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: activeId === item.id ? 500 : 400,
                  color: activeId === item.id ? '#1A1A1A' : '#6B6B6B',
                  transition: 'color .2s ease',
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
