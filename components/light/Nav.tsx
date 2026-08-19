'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        height: 64,
        background: scrolled ? 'rgba(250,248,245,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid #E5E0D8' : '1px solid transparent',
        transition: 'background .2s ease, border-color .2s ease',
      }}
    >
      <Link href="/" aria-label="nothing.ai home" style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
        nothing.ai
      </Link>
      <nav className="hidden sm:flex items-center gap-6" aria-label="Primary">
        <a href="#capture" className="link-warm" style={{ fontSize: 14 }}>Features</a>
        <a href="/privacy" className="link-warm" style={{ fontSize: 14 }}>Privacy</a>
      </nav>
      <a href="/download" className="btn-warm" style={{ padding: '9px 18px', fontSize: 13 }}>
        Download
      </a>
    </header>
  )
}
