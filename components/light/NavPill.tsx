'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// Section anchors are absolute (/#capture) so they work from every page, not
// just the homepage. FAQ stays on-page where the current page has its own.
function navLinks(pathname: string) {
  return [
    { href: '/#capture', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: pathname === '/pricing' ? '#faq' : '/#faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy' },
  ]
}

// Scroll-state (background/shadow past 80px) is IntersectionObserver-driven,
// not a scroll listener: a 1x1px sentinel sits at document-relative top:80px
// (position:absolute with no positioned ancestor scrolls normally with the
// page — only position:fixed would ignore scroll). `scrolled` toggles both
// ways as the sentinel enters/leaves the viewport, unlike the shared
// useInView hook, which is a deliberate one-way latch for its reveal-once
// consumers elsewhere and isn't a fit here — this is its own small observer,
// not a second *kind* of scroll-trigger mechanism (still IntersectionObserver
// only, zero scroll event listeners).
export function NavPill() {
  const pathname = usePathname() ?? '/'
  const links = navLinks(pathname)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Close on Escape (returning focus to the toggle) and on outside click —
  // the panel is only ever mounted while open, so there's no hidden-but-
  // focusable state to worry about (see the old sticky-bar audit finding).
  useEffect(() => {
    if (!menuOpen) return
    panelRef.current?.querySelector('a')?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return
      setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" style={{ position: 'absolute', top: 80, left: 0, width: 1, height: 1, pointerEvents: 'none' }} />
      <div className="sticky top-0 z-50" style={{ padding: '12px 12px 0' }}>
      <header
        className="nav-pill load-nav view-transition-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '0 20px',
          height: 56,
          maxWidth: 1080,
          margin: '0 auto',
          borderRadius: 999,
          background: scrolled ? 'rgba(250,248,245,.88)' : 'rgba(250,248,245,.72)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #E5E0D8',
          boxShadow: scrolled ? '0 8px 24px -12px rgba(26,26,26,.18)' : '0 2px 8px -4px rgba(26,26,26,.08)',
          transition: 'background .25s ease, box-shadow .25s ease',
        }}
      >
        <Link href="/" aria-label="nothing.ai home" style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
          nothing.ai
        </Link>
        <nav className="hidden sm:flex items-center gap-6" aria-label="Primary">
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="link-warm"
              aria-current={link.href === pathname ? 'page' : undefined}
              style={{ fontSize: 14, fontWeight: link.href === pathname ? 600 : undefined }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <a href="/download" className="btn-warm nav-cta" style={{ padding: '9px 18px', fontSize: 13 }}>
            Download
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="flex sm:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(v => !v)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              marginRight: -12,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span aria-hidden="true" style={{ position: 'relative', width: 18, height: 14, display: 'block' }}>
              <span
                style={{
                  position: 'absolute', left: 0, width: 18, height: 2, borderRadius: 1, background: '#1A1A1A',
                  top: menuOpen ? 6 : 0,
                  transform: menuOpen ? 'rotate(45deg)' : 'none',
                  transition: 'transform .2s var(--ease-warm), top .2s var(--ease-warm)',
                }}
              />
              <span
                style={{
                  position: 'absolute', left: 0, top: 6, width: 18, height: 2, borderRadius: 1, background: '#1A1A1A',
                  opacity: menuOpen ? 0 : 1,
                  transition: 'opacity .2s var(--ease-warm)',
                }}
              />
              <span
                style={{
                  position: 'absolute', left: 0, width: 18, height: 2, borderRadius: 1, background: '#1A1A1A',
                  top: menuOpen ? 6 : 12,
                  transform: menuOpen ? 'rotate(-45deg)' : 'none',
                  transition: 'transform .2s var(--ease-warm), top .2s var(--ease-warm)',
                }}
              />
            </span>
          </button>
        </div>
        <span className="nav-progress" aria-hidden="true" />
      </header>
      {menuOpen && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          className="sm:hidden"
          style={{
            position: 'absolute',
            top: '100%',
            left: 12,
            right: 12,
            maxWidth: 1080,
            margin: '8px auto 0',
            background: '#FAF8F5',
            border: '1px solid #E5E0D8',
            borderRadius: 20,
            boxShadow: '0 8px 24px -12px rgba(26,26,26,.18)',
            padding: 8,
          }}
        >
          <nav aria-label="Primary" style={{ display: 'flex', flexDirection: 'column' }}>
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.href === pathname ? 'page' : undefined}
                className="link-warm"
                // Deferred a tick so the browser's native fragment-scroll for
                // this click resolves before the panel (and this link)
                // unmounts, rather than racing it.
                onClick={() => setTimeout(() => setMenuOpen(false), 0)}
                style={{ display: 'flex', alignItems: 'center', minHeight: 44, padding: '0 16px', fontSize: 16, borderRadius: 12 }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
    </>
  )
}
