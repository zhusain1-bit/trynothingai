'use client'

import { useRef } from 'react'
import { capture } from '@/lib/posthog'
import { HeroDemo, type HeroDemoHandle } from '@/components/home/HeroDemo'

export function Hero() {
  const demo = useRef<HeroDemoHandle>(null)
  const demoWrap = useRef<HTMLDivElement>(null)

  function watch() {
    capture('hero_watch_demo_clicked')
    demoWrap.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    demo.current?.restart()
  }

  return (
    <section
      className="flex flex-col items-center text-center px-6"
      style={{ paddingTop: 'clamp(56px,9vw,112px)', paddingBottom: 'clamp(32px,5vw,64px)', background: '#FAF8F5' }}
    >
      <span className="font-mono load-eyebrow" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
        for Windows
      </span>
      <h1
        style={{
          fontFamily: 'var(--font-instrument-serif), Georgia, serif',
          fontSize: 'clamp(44px,7.4vw,76px)',
          lineHeight: 1.02,
          letterSpacing: '-0.02em',
          color: '#1A1A1A',
          marginTop: 16,
          maxWidth: 820,
        }}
      >
        <span className="load-line-mask" style={{ display: 'block' }}><span style={{ '--i': 0 } as React.CSSProperties}>Screenshot it.</span></span>
        <span className="load-line-mask" style={{ display: 'block' }}><span style={{ '--i': 1 } as React.CSSProperties}>It&rsquo;s a row now.</span></span>
      </h1>
      <p className="load-subhead" style={{ fontSize: 18, lineHeight: 1.55, color: '#6B6B6B', marginTop: 20, maxWidth: 540, textWrap: 'balance' }}>
        Turn profiles, jobs, properties, PDFs and more into structured projects — without copying and pasting.
      </p>
      <div className="flex flex-wrap items-center justify-center" style={{ gap: '12px 22px', marginTop: 28 }}>
        <a
          href="/download"
          className="btn-warm load-cta"
          style={{ padding: '14px 28px', fontSize: 15 }}
          onClick={() => capture('hero_download_clicked')}
        >
          Download for Windows
        </a>
        <button
          type="button"
          onClick={watch}
          className="link-warm load-secondary"
          style={{ fontSize: 15, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6.5 5.2v5.6L11 8z" fill="currentColor" />
          </svg>
          Watch it work
        </button>
      </div>
      <span className="font-mono load-macos" style={{ fontSize: 12, color: '#6B6B6B', marginTop: 14 }}>
        Windows 10/11 · macOS coming soon
      </span>
      <div ref={demoWrap} className="w-full load-hero-anim" style={{ marginTop: 'clamp(36px,5vw,56px)', maxWidth: 1040 }}>
        <HeroDemo ref={demo} />
      </div>
    </section>
  )
}
