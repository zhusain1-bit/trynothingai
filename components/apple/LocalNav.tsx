'use client'

import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '#highlights', label: 'highlights' },
  { href: '#calendar', label: 'calendar' },
  { href: '#collections', label: 'collections' },
  { href: '#ask', label: 'ask' },
  { href: '#privacy', label: 'privacy' },
]

// Apple-style product local nav: transparent in place, gains blur when stuck.
export function LocalNav() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

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
            {LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="link-ghost"
                style={{ fontSize: 13, textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a href="#waitlist" className="cta-pill">join waitlist</a>
        </div>
      </nav>
    </>
  )
}
