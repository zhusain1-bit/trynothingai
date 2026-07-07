'use client'

import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '#highlights', label: 'highlights' },
  { href: '#calendar', label: 'calendar' },
  { href: '#collections', label: 'collections' },
  { href: '#ask', label: 'ask' },
  { href: '#privacy', label: 'privacy' },
]

// Apple-style product local nav: transparent in place, gains the glass recipe
// (blur + saturate) when stuck, highlights the section in view, and only
// reveals its CTA pill after the hero's own CTA scrolls away. On mobile the
// title becomes a chevron dropdown holding the section links.
export function LocalNav() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [showCta, setShowCta] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Reveal the pill only once the hero CTA has scrolled off the top
  useEffect(() => {
    const heroCta = document.getElementById('hero-cta')
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fallback: always show the pill if no hero CTA exists to defer against
    if (!heroCta) { setShowCta(true); return }
    const obs = new IntersectionObserver(
      ([entry]) => setShowCta(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    obs.observe(heroCta)
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

  const glass = stuck || menuOpen

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      <nav
        className="sticky top-0 z-50"
        style={{
          background: glass ? 'rgba(10,11,13,.82)' : 'transparent',
          backdropFilter: glass ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: glass ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: glass ? '1px solid var(--hairline)' : '1px solid transparent',
          transition: 'background .28s var(--ease-apple-ui), border-color .28s var(--ease-apple-ui)',
        }}
        aria-label="Product"
      >
        <div className="flex items-center justify-between px-[24px]" style={{ height: 52 }}>
          {/* Desktop: plain wordmark. Mobile: dropdown trigger with chevron. */}
          <span className="hidden md:inline font-semibold lowercase" style={{ fontSize: 14, color: 'var(--mist)' }}>
            nothing.ai
          </span>
          <button
            type="button"
            className="md:hidden inline-flex items-center gap-[7px] font-semibold lowercase"
            style={{ fontSize: 14, color: 'var(--mist)', background: 'transparent', border: 'none', padding: '14px 0' }}
            aria-expanded={menuOpen}
            aria-controls="localnav-menu"
            onClick={() => setMenuOpen(o => !o)}
          >
            nothing.ai
            <svg
              width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--ghost)" strokeWidth="1.5"
              style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .28s var(--ease-apple-ui)' }}
              aria-hidden="true"
            >
              <path d="M2 4.2 6 8.2 10 4.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

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
                    style={{
                      fontSize: 13,
                      textDecoration: 'none',
                      padding: '16px 0',
                      color: isActive ? 'var(--mist)' : undefined,
                      boxShadow: isActive ? 'inset 0 -1px 0 var(--phosphor)' : 'none',
                      transition: 'color .2s var(--ease-apple-ui), box-shadow .2s var(--ease-apple-ui)',
                    }}
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>
            <a
              href="#waitlist"
              className="cta-pill"
              inert={!showCta}
              style={{
                opacity: showCta ? 1 : 0,
                transform: showCta ? 'none' : 'translateY(-4px)',
                transition: 'opacity .3s var(--ease-apple-ui), transform .3s var(--ease-apple-ui)',
              }}
            >
              join waitlist
            </a>
          </div>
        </div>

        {/* Mobile dropdown sheet */}
        <div
          id="localnav-menu"
          className="md:hidden overflow-hidden"
          inert={!menuOpen}
          style={{
            maxHeight: menuOpen ? 300 : 0,
            transition: 'max-height .34s var(--ease-apple-inout)',
            borderTop: menuOpen ? '1px solid var(--hairline)' : 'none',
          }}
        >
          <div className="flex flex-col px-[24px] py-[10px]">
            {LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="link-ghost"
                style={{ fontSize: 14, textDecoration: 'none', padding: '12px 0' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
