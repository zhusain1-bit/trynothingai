'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function NavPill() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 80) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-50" style={{ padding: '12px 12px 0' }}>
      <header
        className="nav-pill"
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
          <a href="#capture" className="link-warm" style={{ fontSize: 14 }}>Features</a>
          <a href="/privacy" className="link-warm" style={{ fontSize: 14 }}>Privacy</a>
        </nav>
        <a href="/download" className="btn-warm nav-cta" style={{ padding: '9px 18px', fontSize: 13 }}>
          Download
        </a>
        <span className="nav-progress" aria-hidden="true" />
      </header>
    </div>
  )
}
