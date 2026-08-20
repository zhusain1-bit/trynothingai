import Link from 'next/link'
import { HeroAnimation } from './HeroAnimation'

export function Hero() {
  return (
    <section
      className="hero-grid px-6"
      style={{ paddingTop: 'clamp(64px,10vw,120px)', paddingBottom: 'clamp(48px,8vw,96px)', background: '#FAF8F5' }}
    >
      <div className="hero-text">
        <span className="font-mono load-eyebrow" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
          Windows · early access
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(40px,4.6vw,60px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#1A1A1A',
            marginTop: 16,
          }}
        >
          <span className="load-line-mask"><span style={{ '--i': 0 } as React.CSSProperties}>Screenshot it now.</span></span>
          <span className="load-line-mask"><span style={{ '--i': 1 } as React.CSSProperties}>Deal with it later.</span></span>
        </h1>
        <p className="load-subhead" style={{ fontSize: 18, lineHeight: 1.6, color: '#6B6B6B', marginTop: 18, maxWidth: 460 }}>
          One key captures anything on your screen. At 5pm your day is written, and nothing you meant to come back to got lost.
        </p>
        <div className="flex flex-col items-start gap-3" style={{ marginTop: 28 }}>
          <Link href="/download" className="btn-warm load-cta" style={{ padding: '14px 28px', fontSize: 15 }}>
            Download for Windows
          </Link>
          <a href="#capture" className="link-warm load-secondary" style={{ fontSize: 13, color: '#6B6B6B' }}>
            see how it works
          </a>
          <span className="font-mono load-macos" style={{ fontSize: 12, color: '#6B6B6B' }}>macOS coming soon</span>
        </div>
      </div>
      <div className="hero-media">
        <div
          className="hero-media-inner load-hero-anim"
          style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)' }}
        >
          <HeroAnimation />
        </div>
      </div>
    </section>
  )
}
