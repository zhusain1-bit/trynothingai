'use client'

import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '#highlights', label: 'highlights' },
  { href: '#calendar', label: 'calendar' },
  { href: '#collections', label: 'collections' },
  { href: '#ask', label: 'ask' },
  { href: '#privacy', label: 'privacy' },
]

// Apple-style product local nav: transparent in place, gains blur when stuck,
// highlights the section currently in view.
export function LocalNav() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Track which linked section is currently on screen
  useEffect(() => {
    const sections = LINKS
      .map(l => document.getElementById(l.href.slice(1)))
      .filter((s): s is HTMLElement => s !== null)
    if (!sections.length) return
    const visible = new Map<string, number>()
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio)
          else visible.delete(e.target.id)
        }
        let best: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) { best = id; bestRatio = ratio }
        }
        setActive(best)
      },
      { threshold: [0.15, 0.4], rootMargin: '-52px 0px 0px 0px' },
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-[24px]"
        style={{
          height: 52,
          background: stuck ? 'rgba(10,11,13,.85)' : 'transparent',
          backdropFilter: stuck ? 'blur(20px) saturate(1.1)' : 'none',
          WebkitBackdropFilter: stuck ? 'blur(20px) saturate(1.1)' : 'none',
          borderBottom: stuck ? '1px solid var(--hairline)' : '1px solid transparent',
          transition: 'background .3s var(--ease), border-color .3s var(--ease)',
        }}
        aria-label="Product"
      >
        <span className="font-semibold lowercase" style={{ fontSize: 14, color: 'var(--mist)' }}>
          nothing.ai
        </span>
        <div className="flex items-center gap-[22px]">
          <div className="hidden md:flex items-center gap-[22px]">
            {LINKS.map(link => {
              const isActive = active === link.href.slice(1)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={isActive ? undefined : 'link-ghost'}
                  aria-current={isActive || undefined}
                  // Full-bar-height tap zone; underline marks the active section
                  style={{
                    fontSize: 13,
                    textDecoration: 'none',
                    padding: '16px 0',
                    color: isActive ? 'var(--mist)' : undefined,
                    boxShadow: isActive ? 'inset 0 -1px 0 var(--phosphor)' : 'none',
                    transition: 'color .2s, box-shadow .2s',
                  }}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
          <a href="#waitlist" className="cta-pill">join waitlist</a>
        </div>
      </nav>
    </>
  )
}
